const bunyan = require('bunyan')
const { logentriesToken } = require('config')
const logger = require('le_node')

const loggerDef = logentriesToken
  ? logger.bunyanStream({ token: logentriesToken })
  : { name: 'bkmrkd' }
const log = bunyan.createLogger(loggerDef)

module.exports = {
  log,
  loggerDef
}
