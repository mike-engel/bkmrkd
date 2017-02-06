const { allowedFields } = require('server/constants/bookmark')
const { eventBus } = require('server/utils')
const { knex } = require('config/db')
const { log } = require('server/utils')
const { omit, pick } = require('ramda')

const sanitize = pick(allowedFields)

// create :: Object -> Promise
const create = (data) => {
  const bookmark = sanitize(data)

  return new Promise((resolve, reject) => {
    knex('bookmarks')
      .returning(allowedFields)
      .insert(bookmark)
      .then((newBookmarks) => {
        eventBus.emit('bookmark.created', newBookmarks[0])

        log.info({ bookmark: newBookmarks[0] }, 'bookmark created')

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
      .returning(allowedFields)
      .where(bookmarkQuery)
      .delete()
      .then((deletedBookmarks) => {
        eventBus.emit('bookmark.deleted', deletedBookmarks[0])

        log.info({ bookmark: deletedBookmarks[0] }, 'bookmark deleted')

        resolve(deletedBookmarks[0])
      })
      .catch(reject)
  })
}

// find :: Query -> Promise
const find = (query) => {
  return new Promise((resolve, reject) => {
    knex('bookmarks')
      .returning(allowedFields)
      .offset(query.offset || 0)
      .limit(query.limit || null)
      .where(omit(['limit', 'offset'], query))
      .then(resolve)
      .catch(reject)
  })
}

// search :: Query -> Promise
const search = (searchTerm) => {
  return new Promise((resolve, reject) => {
    knex('bookmarks')
      .returning(allowedFields)
      .where('title', 'like', `%${searchTerm}%`)
      .then(resolve)
      .catch(reject)
  })
}

module.exports = {
  create,
  destroy,
  find,
  search
}
