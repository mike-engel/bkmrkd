import { join } from 'path'
import gulp from 'gulp'
import browserify from 'browserify'
import watchify from 'watchify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import uglify from 'gulp-uglify'
import sourcemaps from 'gulp-sourcemaps'
import gulpif from 'gulp-if'
import shouldWatch from './shouldWatch'
import handleError from './handleError'
import browsersync from 'browser-sync'

export default gulp.task('scripts', () => {
  let b = browserify({
    entries: [join(__dirname, '../src/js/main.js')],
    cache: {},
    packageCache: {},
    standalone: 'bkmrkd'
  })

  if (shouldWatch()) {
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
    .pipe(gulpif(!shouldWatch(), uglify()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(join(__dirname, '../dist/js')))
    .pipe(browsersync.stream({
      once: true
    }))
})
