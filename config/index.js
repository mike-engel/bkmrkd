const env = process.env

module.exports = {
  db: {
    autoMigrate: env.DB_MIGRATE || true,
    host: env.DB_HOST || 'localhost',
    name: env.DB_NAME || `bkmrkd_${env.NODE_ENV || 'development'}`,
    port: env.DB_PORT || 5432,
    password: env.DB_PASS || 'password',
    user: env.DB_USER || 'postgres'
  },
  env: env.NODE_ENV || 'development',
  port: env.PORT || 3000
}
