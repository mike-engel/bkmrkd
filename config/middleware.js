const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const hpp = require('hpp')
const helmet = require('helmet')
const config = require('config')

module.exports = function (app) {
  app.use(compression())
  app.use('/static', express.static('./static', {
    maxAge: config.env === 'development' ? 0 : 31500000000,
    index: false
  }))
  app.use(bodyParser.json())
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
  app.use(helmet.ieNoOpen())
  app.use(helmet.noSniff())
}
