import test from 'tape'
import deleteAllBookmarks from '../../seeds/deleteAllBookmarks'
import underLimit from '../../seeds/underLimit'
import getBookmarks from '../../../helpers/getBookmarks'

test('getBookmarks helper', (t) => {
  t.plan(4)

  setTimeout(() => {
    deleteAllBookmarks(() => {
      getBookmarks(1, 25, (err, bookmarks) => {
        if (err) {
          t.fail('It failed because: ', err)
        }

        t.ok(Array.isArray(bookmarks), 'It sends back an array of bookmarks')
        t.equal(bookmarks.length, 0, 'It sends back an empty array if no bookmarks are in the table')

        underLimit(() => {
          getBookmarks(1, 25, (err, bookmarks) => {
            if (err) {
              t.fail('It failed because: ', err)
            }

            t.ok(Array.isArray(bookmarks), 'It sends back an array of bookmarks')
            t.equal(bookmarks.length, 10, 'It sends back all the bookmarks in the table')
            t.end()
          })
        })
      })
    })
  }, 1000)
})
