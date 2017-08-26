require("rootpath")();

const config = require("config");
const chai = require("chai");
const { knex, config: knexConfig } = require("config/db");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");

if (config.db.autoMigrate) {
  knex.migrate.latest(knexConfig);
}

chai.use(sinonChai);

Object.assign(global, {
  expect: chai.expect,
  sinon
});
