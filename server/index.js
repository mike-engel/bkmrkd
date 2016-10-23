const apiRouter = require('server/api')
const configServer = require('config/server')
const configMiddleware = require('config/middleware')
const { internalErrorHandler, notFoundHandler } = require('server/errors')
const express = require('express')
const http = require('http')
const { main: sockets } = require('server/sockets')

const app = express()
const server = http.createServer(app)

configServer(app)
configMiddleware(app)

// app.use(/^\/|^\/colophon/, mainRouter)
app.use('/api', apiRouter)
app.use(notFoundHandler)
app.use(internalErrorHandler)

sockets(server)

module.exports = {
  app,
  server
}
