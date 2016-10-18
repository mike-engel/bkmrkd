require('rootpath')()

const config = require('config')
const { expect } = require('chai')
const { knex, config: knexConfig } = require('config/db')

if (config.db.autoMigrate) {
  knex.migrate.latest(knexConfig)
}

Object.assign(global, {
  expect
})
