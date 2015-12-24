import gulp from 'gulp'
import { join } from 'path'
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
import sourcemaps from 'gulp-sourcemaps'
import browsersync from 'browser-sync'

export default gulp.task('styles', () => {
  return gulp.src(join(__dirname, '../src/css/main.css'))
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
    .pipe(gulp.dest(join(__dirname, '../dist/css/')))
    .pipe(browsersync.stream({
      once: true
    }))
})
