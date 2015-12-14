import gulp from 'gulp'
import './gulp-includes/scripts'
import './gulp-includes/styles'
import './gulp-includes/browsersync'

gulp.task('default', ['scripts', 'styles', 'browsersync'], () => {
  gulp.watch('./src/js/**/*.js', ['scripts'])
  gulp.watch('./src/css/**/*.css', ['styles'])
})

gulp.task('dist', ['scripts'])
