import test from 'tape'
import rethink from 'rethinkdb'
import countBookmarks from '../../../helpers/countBookmarks'
import { bookmarks, connection } from '../../../config/rethinkdb'

test('countBookmarks helper', (t) => {
  t.plan(2)

  setTimeout(() => {
    countBookmarks((count) => {
      t.ok(count, 'It provides a bookmark count')

      bookmarks.insert({
        title: 'test',
        url: 'https://google.com',
        createdOn: rethink.now()
      }).run(connection, (err) => {
        if (err) {
          t.fail('It failed because: ', err)
        }

        countBookmarks((newCount) => {
          t.equal(newCount, count + 1, 'It correctly counts after a modification to the table')
          t.end()
        })
      })
    })
  }, 1000)
})
