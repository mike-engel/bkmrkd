import gulp from 'gulp'
import { join } from 'path'
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

gulp.task('default', ['scripts', 'browsersync'], () => {
  gulp.watch('./src/js/**/*.js', ['scripts'])
})

gulp.task('dist', ['scripts'])
