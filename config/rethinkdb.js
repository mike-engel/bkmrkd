const { db } = require('./index')
const rethinkdb = require('rethinkdbdash')
const rethinkConfig = {
  db: db.name,
  host: db.host,
  port: db.port
}

module.exports = rethinkdb(rethinkConfig)
