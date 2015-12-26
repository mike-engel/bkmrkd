import test from 'tape'
import searchBookmarks from '../../../helpers/searchBookmarks'
import destroyAllBookmarks from '../../seeds/deleteAllBookmarks'
import underLimit from '../../seeds/underLimit'

test('searchBookmarks helper', (t) => {
  t.plan(4)

  destroyAllBookmarks(() => {
    searchBookmarks('test 1', (err, bookmarks) => {
      if (err) {
        t.fail('It failed because: ', err)
      }

      t.ok(Array.isArray(bookmarks), 'It returns an array of bookmarks')
      t.equal(bookmarks.length, 0, 'It returns an empty array when nothing matches')

      underLimit(() => {
        searchBookmarks('test 1', (err, bookmarks) => {
          if (err) {
            t.fail('It failed because: ', err)
          }

          t.ok(Array.isArray(bookmarks), 'It returns an array of bookmarks')
          t.equal(bookmarks.length, 2, 'It returns the results based off of the search term')
        })
      })
    })
  })
})
