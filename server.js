import fs from 'fs'
import express from 'express'
import spdy from 'spdy'
import config, { args } from './helpers/config'
import appConfig from './config/app'
import errorRoutes from './routes/errors'
import socketRoutes from './routes/sockets'
import { apiRouter } from './routes/api'
import { mainRouter } from './routes/main'

const env = process.env.NODE_ENV || 'development'
const port = config[env].port || args.p || args.port || 3000
const spdyOptions = {
  key: fs.readFileSync(config[env].certKey),
  cert: fs.readFileSync(config[env].cert)
}

export const app = express()
export const server = spdy.createServer(spdyOptions, app)

appConfig(app)

app.use('/', mainRouter)
app.use('/api', apiRouter)

socketRoutes(server)

errorRoutes(app)

server.listen(port)
console.info('Bkmrkd has been started on port 3000.')
