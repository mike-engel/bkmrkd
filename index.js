require('rootpath')()

const { app, server } = require('server')
const config = require('config')
const { knex, config: knexConfig } = require('config/db')
const { log } = require('server/utils')

if (config.db.autoMigrate) {
  knex.migrate.latest(knexConfig)
}

server.listen(config.port, app)

log.info(`bkmrkd has been started on port ${config.port}.`)
log.info(`
Startup config:
  ${JSON.stringify(config, null, 2)}
`)
