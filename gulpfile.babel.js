import gulp from 'gulp'
import less from 'gulp-less'
import autoprefixer from 'autoprefixer-core'
import postcss from 'gulp-postcss'
import csslint from 'gulp-csslint'
import browserify from 'browserify'
import watchify from 'watchify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import uglify from 'gulp-uglify'
import gulpif from 'gulp-if'
import browsersync from 'browser-sync'

function evalWatch() {
  if ((process.env.NODE_ENV && process.env.NODE_ENV !== 'development') || process.argv[1] === 'dist') {
    return false
  }

  return true
}

gulp.task('styles', () => {
  gulp.src('./lib/less/bkmrkd.less')
    .pipe(less())
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 2 versions']
      })
    ]))
    .pipe(csslint())
    .pipe(gulp.dest('./dist/css'))
})

gulp.task('scripts', () => {
  let b = browserify({
      entries: './lib/js/*.jsx',
      cache: {},
      packageCache: {}
    })

  if (evalWatch()) {
    b = watchify(b)
  }

  b.transform('babelify')
  b.plugin('bundle-collapser/plugin')

  b.bundle()
    .pipe(source('bkmrkd.js'))
    .pipe(buffer())
    .pipe(gulpif(evalWatch(), uglify()))
    .pipe(gulp.dest('./dist/js'))
})

gulp.task('default', ['styles'])
