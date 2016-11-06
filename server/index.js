const apiRouter = require('server/api')
const configServer = require('config/server')
const configMiddleware = require('config/middleware')
const contentRouter = require('server/content')
const express = require('express')
const http = require('http')
const { internalErrorHandler, notFoundHandler } = require('server/errors')
const { main: sockets } = require('server/sockets')
const {
  middleware: {
    express: {
      errorHandler,
      requestHandler
    }
  }
} = require('raven')
const { ravenUrl } = require('config')

const app = express()
const server = http.createServer(app)

configServer(app)
configMiddleware(app)

if (ravenUrl) app.use(requestHandler(ravenUrl))

app.use(contentRouter)
app.use('/api', apiRouter)
app.use(notFoundHandler)

if (ravenUrl) app.use(errorHandler(ravenUrl))

app.use(internalErrorHandler)

sockets(server)

module.exports = {
  app,
  server
}
