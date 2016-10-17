const { apiRouter } = require('routes/api')
const configServer = require('config/server')
const configMiddleware = require('config/middleware')
const errorRoutes = require('routes/errors')
const express = require('express')
const { mainRouter } = require('routes/main')
const socketRoutes = require('routes/sockets')

const app = express()

configServer(app)
configMiddleware(app)

app.use(/^\/|^\/colophon/, mainRouter)
app.use('/api', apiRouter)

socketRoutes(app)

errorRoutes(app)

module.exports = app
