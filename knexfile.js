require('rootpath')()

const { config } = require('config/db')

module.exports = {
  development: config,
  staging: config,
  production: config
}
