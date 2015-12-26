import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import hpp from 'hpp'
import helmet from 'helmet'
import config from '../helpers/config'

const env = process.env.NODE_ENV || 'development'

export default function (app) {
  app.set('view engine', 'ejs')
  app.set('x-powered-by', false)
  app.set('trust proxy', true)
  app.set('query parser', 'simple')

  app.use(compression())
  app.use(express.static('./dist', {
    maxAge: env === 'development' ? 0 : 31500000000,
    index: false
  }))
  app.use(bodyParser.urlencoded({
    extended: false
  }))
  app.use(hpp())
  app.use(helmet.contentSecurityPolicy({
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'"],
    imgSrc: ["'none'"],
    connectSrc: ["'self'", 'ws:', 'wss:'],
    fontSrc: ["'none'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'none'"],
    frameSrc: ["'none'"]
  }))
  app.use(helmet.xssFilter())
  app.use(helmet.frameguard('deny'))
  app.use(helmet.hsts({
    maxAge: 31500000000,
    includeSubdomains: true
  }))
  app.use(helmet.ieNoOpen())
  app.use(helmet.noSniff())
  app.use(helmet.hpkp({
    maxAge: 7776000000,
    sha256s: config[env].publicKeyPins
  }))
}
