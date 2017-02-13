const { resolve } = require('path')

module.exports = function (app) {
  app.set('view engine', 'ejs')
  app.set('views', resolve(__dirname, '..', 'server/views'))
  app.set('query parser', 'simple')
  app.set('trust proxy', true)
  app.set('x-powered-by', false)
}
