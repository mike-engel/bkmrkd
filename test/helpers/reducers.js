import test from 'tape'
import { bookmarks, endOfBookmarks, networkState, page, toaster } from '../../src/js/helpers/reducers'
import { addBookmark } from '../../src/js/helpers/actions'
import { combineReducers, createStore } from 'redux'

const reducers = combineReducers({
  bookmarks,
  endOfBookmarks,
  networkState,
  page,
  toaster
})
const store = createStore(reducers, {
  bookmarks: [],
  networkState: '',
  toaster: [],
  page: 1,
  endOfBookmarks: false
})

test('It updates the bookmarks', (t) => {
  const bookmark = {
    id: 1,
    title: 'Test',
    url: 'http://google.com',
    createdOn: new Date()
  }

  t.ok(Array.isArray(store.getState().bookmarks), 'It has an initial state as an array')
  t.equal(store.getState().bookmarks.length, 0, 'It has an initial empty array')

  store.dispatch(addBookmark(bookmark))

  t.ok(Array.isArray(store.getState().bookmarks), 'It still has an array of bookmarks')
  t.equal(store.getState().bookmarks[0], bookmark, 'It adds the new bookmark to the state')
  t.end()
})
