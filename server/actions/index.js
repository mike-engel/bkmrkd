const { allowedFields } = require('server/constants/bookmark')
const { knex } = require('config/db')
const { pick } = require('ramda')

const sanitize = pick(allowedFields)

// create :: Object -> Promise
const create = (data) => {
  const bookmark = sanitize(data)

  return new Promise((resolve, reject) => {
    knex('bookmarks')
      .returning(allowedFields)
      .insert(bookmark)
      .then((newBookmarks) => {
        resolve(newBookmarks[0])
      })
      .catch(reject)
  })
}

// destroy :: Query -> Promise
const destroy = (query) => {
  const bookmarkQuery = sanitize(query)

  return new Promise((resolve, reject) => {
    knex('bookmarks')
      .where(bookmarkQuery)
      .delete()
      .then(resolve)
      .catch(reject)
  })
}

// find :: Query -> Promise
const find = (query) => {
  const bookmarkQuery = sanitize(query)

  return new Promise((resolve, reject) => {
    knex('bookmarks')
      .returning(allowedFields)
      .where(bookmarkQuery)
      .then(resolve)
      .catch(reject)
  })
}

module.exports = {
  create,
  destroy,
  find
}
