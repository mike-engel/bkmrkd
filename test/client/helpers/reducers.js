import test from 'tape'
import { bookmarks, endOfBookmarks, networkState, page, searchTerm, toaster } from '../../../src/js/helpers/reducers'
import { addBookmark, addToast, changePage, destroyBookmark, endOfBookmarks as endOfBookmarksAction, requestLoading, requestFinished, setSearchTerm, updateBookmarks } from '../../../src/js/helpers/actions'
import { REQUEST_LOADING } from '../../../src/js/helpers/actionTypes'
import { combineReducers, createStore } from 'redux'

const reducers = combineReducers({
  bookmarks,
  endOfBookmarks,
  networkState,
  page,
  searchTerm,
  toaster
})
const store = createStore(reducers, {
  bookmarks: [],
  endOfBookmarks: false,
  networkState: '',
  toaster: [],
  searchTerm: '',
  page: 1
})

test('bookmarks reducer', (t) => {
  const bookmark = {
    id: 1,
    title: 'Test',
    url: 'http://google.com',
    createdOn: new Date()
  }

  t.ok(Array.isArray(store.getState().bookmarks), 'It has an initial state as an array')
  t.equal(store.getState().bookmarks.length, 0, 'It has an initial empty array')

  store.dispatch(addBookmark(bookmark))

  t.equal(store.getState().bookmarks.length, 1, 'It adds the new bookmark to the array')
  t.equal(store.getState().bookmarks[0], bookmark, 'It adds the new bookmark to the state')

  store.dispatch(destroyBookmark(1))

  t.equal(store.getState().bookmarks.length, 0, 'It deletes the bookmark with the dispatched ID')

  store.dispatch(updateBookmarks([bookmark]))

  t.equal(store.getState().bookmarks.length, 1, 'It replaces the bookmarks with a new set of bookmarks')
  t.end()
})

test('endOfBookmarks reducer', (t) => {
  t.equal(store.getState().endOfBookmarks, false, 'It has an initial state of false')

  store.dispatch(endOfBookmarksAction(true))

  t.equal(store.getState().endOfBookmarks, true, 'It updates the end of bookmarks state to true')

  store.dispatch(endOfBookmarksAction(false))

  t.equal(store.getState().endOfBookmarks, false, 'It updates the end of bookmarks state back to false')
  t.end()
})

test('networkState reducer', (t) => {
  t.equal(store.getState().networkState, '', 'It has an initial state as an empty string')

  store.dispatch(requestLoading())

  t.equal(store.getState().networkState, REQUEST_LOADING, 'It updates the network state to REQUEST_LOADING')

  store.dispatch(requestFinished())

  t.equal(store.getState().networkState, '', 'It updates the network state upon finish')
  t.end()
})

test('searchTerm reducer', (t) => {
  t.equal(typeof store.getState().searchTerm, 'string', 'It has an initial state of string')

  store.dispatch(setSearchTerm('test'))

  t.equal(store.getState().searchTerm, 'test', 'It sets the search term when dispatched')

  store.dispatch(setSearchTerm(''))

  t.equal(store.getState().searchTerm, '', 'It sets the search term subsequent times when dispatched')
  t.end()
})

test('toaster reducer', (t) => {
  const toast = {
    message: 'This is a toast!',
    style: 'success'
  }

  t.ok(Array.isArray(store.getState().toaster), 'It has an initial state as an array')
  t.equal(store.getState().toaster.length, 0, 'It has an initial state as an empty array')

  store.dispatch(addToast(toast))

  t.equal(store.getState().toaster.length, 1, 'It adds the toast to the toaster')
  t.equal(store.getState().toaster[0].message, toast.message, 'It adds the toast that was dispatched')

  store.dispatch(addToast(toast))

  t.equal(store.getState().toaster.length, 2, 'It adds another toast to the toaster if dispatched')
  t.end()
})

test('page reducer', (t) => {
  t.equal(store.getState().page, 1, 'It has an initial state as 1')

  store.dispatch(changePage(2))

  t.equal(store.getState().page, 2, 'It updates the page to the number dispatched')
  t.end()
})
