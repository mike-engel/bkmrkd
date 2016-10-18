const apiRouter = require('server/api')
const configServer = require('config/server')
const configMiddleware = require('config/middleware')
const errorRouter = require('server/errors')
const express = require('express')
// const socketRoutes = require('routes/sockets')

const app = express()

configServer(app)
configMiddleware(app)

// app.use(/^\/|^\/colophon/, mainRouter)
app.use('/api', apiRouter)
app.use(errorRouter)

// socketRoutes(app)

module.exports = app
