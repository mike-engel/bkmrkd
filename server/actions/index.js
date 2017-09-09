const { allowedFields } = require("server/constants/bookmark");
const { knex } = require("config/db");
const { log } = require("server/utils");
const { omit, pick } = require("ramda");

const sanitize = pick(allowedFields);

// create :: Object -> Promise
const create = data => {
  const bookmark = sanitize(data);

  return knex("bookmarks")
    .returning(allowedFields)
    .insert(bookmark)
    .then(newBookmarks => {
      log.info({ bookmark: newBookmarks[0] }, "bookmark created");

      return newBookmarks[0];
    });
};

// destroy :: Query -> Promise
const destroy = query => {
  const bookmarkQuery = sanitize(query);

  return knex("bookmarks")
    .returning(allowedFields)
    .where(bookmarkQuery)
    .delete()
    .then(deletedBookmarks => {
      log.info({ bookmark: deletedBookmarks[0] }, "bookmark deleted");

      return deletedBookmarks[0];
    });
};

// find :: Query -> Promise
const find = query => {
  return knex("bookmarks")
    .returning(allowedFields)
    .offset(query.offset || 0)
    .limit(query.limit || null)
    .where(omit(["limit", "offset"], query))
    .orderBy("createdAt", "desc");
};

// search :: Query -> Promise
const search = searchTerm => {
  return knex("bookmarks")
    .returning(allowedFields)
    .whereRaw(`LOWER(title) LIKE '%${searchTerm.toLowerCase()}%'`)
    .orderBy("createdAt", "desc");
};

module.exports = {
  create,
  destroy,
  find,
  search
};
