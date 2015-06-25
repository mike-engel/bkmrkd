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

function evalWatch () {
  if ((process.env.NODE_ENV && process.env.NODE_ENV !== 'development') || process.argv[2] === 'dist') {
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
    .pipe(browsersync.stream({
      once: true
    }))
})

gulp.task('scripts', () => {
  let b = browserify({
      entries: ['./lib/js/bkmrkd.js'],
      cache: {},
      packageCache: {},
      standalone: 'bkmrkd'
    })

  if (evalWatch()) {
    b = watchify(b)
  }

  b.transform('babelify')
  b.plugin('brfs')
  b.plugin('bundle-collapser/plugin')

  b.bundle()
    .pipe(source('bkmrkd.js'))
    .pipe(buffer())
    .pipe(gulpif(!evalWatch(), uglify()))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browsersync.stream({
      once: true
    }))
})

gulp.task('browsersync', () => {
  browsersync.init({
    proxy: 'localhost:3000',
    open: false,
    notify: false
  })
})

gulp.task('default', ['styles', 'scripts', 'browsersync'], () => {
  gulp.watch('./lib/js/**/*.js', ['scripts'])
  gulp.watch('./lib/js/**/*.jsx', ['scripts'])
  gulp.watch('./lib/less/**/*', ['styles'])
})

gulp.task('dist', ['styles', 'scripts'])
