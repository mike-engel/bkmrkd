const { apiRouter } = require('./routes/api')
const configApp = require('./config/app')
const configMiddleware = require('./config/middleware')
const errorRoutes = require('./routes/errors')
const express = require('express')
const { mainRouter } = require('./routes/main')
const { searchRouter } = require('./routes/search')
const socketRoutes = require('./routes/sockets')

const app = express()

configApp(app)
configMiddleware(app)

app.use(/^\/|^\/colophon/, mainRouter)
app.use('/api', apiRouter)
app.use('/search', searchRouter)

socketRoutes(app)

errorRoutes(app)

module.exports = app
