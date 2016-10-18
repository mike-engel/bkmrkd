const { knex } = require('config/db')

after((done) => {
  knex('bookmarks').truncate().then(() => done())
})
