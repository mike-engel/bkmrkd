import gulp from 'gulp'
import browsersync from 'browser-sync'

export default gulp.task('browsersync', () => {
  browsersync.init({
    proxy: 'https://localhost:3000',
    open: false,
    notify: false,
    https: true
  })
})
