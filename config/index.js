const env = process.env

module.exports = {
  db: {
    host: env.DB_HOST || 'localhost',
    name: env.DB_NAME || `bkmrkd_${env}`,
    port: env.DB_PORT || 28015
  },
  env: env.NODE_ENV || 'development',
  port: env.PORT || 3000
}
