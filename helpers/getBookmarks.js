import rethink from 'rethinkdb'
import { bkmrkd, connection } from '../config/rethinkdb'

export default function (pageNumber, limit, cb) {
  bkmrkd.table('bookmarks').orderBy({
    index: rethink.desc('createdOn')
  }).skip(limit * (pageNumber - 1)).limit(limit).run(connection, (err, cursor) => {
    if (err) {
      console.error('Error getting the initial list of bookmarks: ', err)
      return cb({
        error: err,
        message: 'There\'s been an error getting the initial list of bookmarks.'
      })
    }

    cursor.toArray((err, results) => {
      if (err) {
        console.error('Error getting the initial list of bookmarks: ', err)

        return cb({
          error: err,
          message: 'There\'s been an error getting the initial list of bookmarks.'
        })
      }

      return cb(null, results)
    })
  })
}
