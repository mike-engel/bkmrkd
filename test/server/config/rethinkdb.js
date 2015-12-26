import test from 'tape'
import { connection, bkmrkd, bookmarks } from '../../../config/rethinkdb'

test('rethinkdb config', (t) => {
  t.plan(3)

  setTimeout(() => {
    t.ok(connection, 'It exports the rethink connection object')
    t.ok(bkmrkd, 'It exports the bkmrkd db reference')
    t.ok(bookmarks, 'It exports the bookmarks table reference')
    t.end()
  }, 1000)
})
