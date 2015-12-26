import test from 'tape'
import renderApp from '../../../helpers/renderApp'
import createStore from '../../../helpers/createStore'

test('renderApp helpers', (t) => {
  const store = createStore({
    bookmarks: [],
    endOfBookmarks: true,
    networkState: '',
    page: 1,
    searchTerm: '',
    toaster: []
  })

  renderApp(store, '/', (err, appMarkup) => {
    if (err) {
      t.fail('It failed because: ', err)
    }

    t.equal(typeof appMarkup, 'string', 'It returns a string')
    t.ok(/<div/i.test(appMarkup), 'It returns an HTML string')
    t.end()
  })
})
