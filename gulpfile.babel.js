import gulp from 'gulp'
import { join } from 'path'
import browserify from 'browserify'
import watchify from 'watchify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import uglify from 'gulp-uglify'
import sourcemaps from 'gulp-sourcemaps'
import postcss from 'gulp-postcss'
import cssImport from 'postcss-import'
import cssnano from 'cssnano'
import cssnext from 'cssnext'
import customMedia from 'postcss-custom-media'
import rgbaFallback from 'postcss-color-rgba-fallback'
import vmin from 'postcss-vmin'
import pixrem from 'pixrem'
import nested from 'postcss-nested'
import mqPacker from 'css-mqpacker'
import autoprefixer from 'autoprefixer'
import gulpif from 'gulp-if'
import browsersync from 'browser-sync'

function evalWatch () {
  if ((process.env.NODE_ENV && process.env.NODE_ENV !== 'development') || process.argv[2] === 'dist') {
    return false
  }

  return true
}

function handleError (err) {
  if (err) {
    console.error(`Error during the gulp build: ${err}`)
    process.exit(1)
  }
}

gulp.task('scripts', () => {
  let b = browserify({
    entries: [join(__dirname, './src/js/main.js')],
    cache: {},
    packageCache: {},
    standalone: 'bkmrkd'
  })

  if (evalWatch()) {
    b = watchify(b)
    // b.plugin('browserify-hmr')
  }

  b.transform('babelify', {
    presets: [
      'es2015',
      'stage-0',
      'react'
    ]
  })
  b.plugin('brfs')
  b.plugin('bundle-collapser/plugin')

  b.bundle()
    .on('error', handleError)
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(gulpif(!evalWatch(), uglify()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browsersync.stream({
      once: true
    }))
})

gulp.task('styles', () => {
  return gulp.src('./src/css/main.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([
      cssImport(),
      nested(),
      cssnano(),
      cssnext(),
      customMedia(),
      rgbaFallback(),
      vmin(),
      pixrem(),
      mqPacker({
        sort: true
      }),
      autoprefixer({
        browsers: ['last 2 versions']
      })
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css/'))
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

gulp.task('default', ['scripts', 'styles', 'browsersync'], () => {
  gulp.watch('./src/js/**/*.js', ['scripts'])
  gulp.watch('./src/css/**/*.css', ['styles'])
})

gulp.task('dist', ['scripts'])
