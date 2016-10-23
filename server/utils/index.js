const bunyan = require('bunyan')
const { logentriesToken } = require('config')
const logger = require('le_node')
const EventEmitter = require('events')

const eventBus = new EventEmitter()
const loggerDef = logentriesToken
  ? logger.bunyanStream({ token: logentriesToken })
  : { name: 'bkmrkd' }
const log = bunyan.createLogger(loggerDef)

module.exports = {
  eventBus,
  log,
  loggerDef
}
