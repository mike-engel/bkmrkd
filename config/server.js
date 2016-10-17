module.exports = function (app) {
  app.set('view engine', 'ejs')
  app.set('x-powered-by', false)
  app.set('trust proxy', true)
  app.set('query parser', 'simple')
}
