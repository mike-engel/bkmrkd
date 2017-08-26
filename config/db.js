const { db } = require("config");
const knex = require("knex");
const knexConfig = {
  client: "pg",
  connection: {
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.name
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: "knex_migrations"
  }
};

module.exports = {
  knex: knex(knexConfig),
  config: knexConfig
};
