import test from 'tape'
import createStore from '../../../helpers/createStore'
import { endOfBookmarks } from '../../../src/js/helpers/actions'

test('createStore helper', (t) => {
  const store = createStore({
    bookmarks: [],
    endOfBookmarks: true,
    networkState: '',
    page: 1,
    searchTerm: '',
    toaster: []
  })

  t.equal(typeof store, 'object', 'It returns an object')
  t.equal(store.getState().endOfBookmarks, true, 'It uses the initial state to seed the store')

  store.dispatch(endOfBookmarks(false))

  t.equal(store.getState().endOfBookmarks, false, 'It includes the bkmrkd reducers')
  t.end()
})
