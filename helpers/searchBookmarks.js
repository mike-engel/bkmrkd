import { bookmarks, connection } from '../config/rethinkdb'

export default function (searchTerm, cb) {
  bookmarks.filter((bookmark) => {
    return bookmark('title').downcase().match(searchTerm)
      .or(bookmark('url').downcase().match(searchTerm))
  }).run(connection, (err, cursor) => {
    if (err) {
      console.error('Error searching for bookmarks: ', err)

      return cb({
        error: err,
        message: 'There was an error searching through the bookmarks.'
      })
    }

    cursor.toArray((err, results) => {
      if (err) {
        console.error('Error searching for bookmarks: ', err)

        return cb({
          error: err,
          message: 'There was an error searching through the bookmarks.'
        })
      }

      return cb(null, results)
    })
  })
}
