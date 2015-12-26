import { bkmrkd, connection } from '../config/rethinkdb'

export default function (cb) {
  bkmrkd.table('bookmarks').count().run(connection, (err, count) => {
    if (err) {
      console.error('Error counting the bookmarks!')
    }

    cb(count)
  })
}
