exports.up = function (knex) {
  return knex.schema.createTable('bookmarks', (table) => {
    table.increments('id')
    table.text('title').notNullable()
    table.text('url').notNullable()
    table.timestamp('createdAt').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('bookmarks')
}
