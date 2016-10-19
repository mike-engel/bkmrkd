require('rootpath')()

const { app, server } = require('server')
const config = require('config')
const { knex, config: knexConfig } = require('config/db')

if (config.db.autoMigrate) {
  knex.migrate.latest(knexConfig)
}

server.listen(config.port, app)

console.info(`bkmrkd has been started on port ${config.port}.`)
console.info(`
Startup config:
  ${JSON.stringify(config, null, 2)}
`)
