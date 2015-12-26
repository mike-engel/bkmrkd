import test from 'tape'
import { addBookmark, addToast, changePage, destroyBookmark, endOfBookmarks, requestLoading, requestFinished, setSearchTerm, updateBookmarks } from '../../../src/js/helpers/actions'
import { ADD_BOOKMARK, ADD_TOAST, CHANGE_PAGE, DESTROY_BOOKMARK, END_OF_BOOKMARKS, REQUEST_LOADING, REQUEST_FINISHED, SEARCH_TERM, UPDATE_BOOKMARKS } from '../../../src/js/helpers/actionTypes'

test('addBookmark action', (t) => {
  const bookmark = {
    id: 1,
    title: 'Test',
    url: 'http://google.com',
    createdOn: new Date()
  }
  const response = addBookmark(bookmark)

  t.ok(response, 'It returns something')
  t.equal(typeof response, 'object', 'It returns an object')
  t.equal(response.type, ADD_BOOKMARK, 'It returns a type of ADD_BOOKMARK')
  t.equal(response.bookmark, bookmark, 'It returns the bookmark sent in as bookmark')
  t.end()
})

test('addToast action', (t) => {
  const toast = {
    message: 'This is a sample toast',
    style: 'success'
  }
  const response = addToast(toast)

  t.ok(response, 'It returns something')
  t.equal(typeof response, 'object', 'It returns an object')
  t.equal(response.type, ADD_TOAST, 'It returns a type of ADD_TOAST')
  t.equal(response.message, 'This is a sample toast', 'It returns the toast message sent in as message')
  t.equal(response.style, 'success', 'It returns the toast style sent in as style')
  t.end()
})

test('changePage action', (t) => {
  const response = changePage(1)

  t.ok(response, 'It returns something')
  t.equal(typeof response, 'object', 'It returns an object')
  t.equal(response.type, CHANGE_PAGE, 'It returns a type of CHANGE_PAGE')
  t.equal(response.page, 1, 'It returns the page number sent in as page')
  t.end()
})

test('destroyBookmark action', (t) => {
  const response = destroyBookmark(1)

  t.ok(response, 'It returns something')
  t.equal(typeof response, 'object', 'It returns an object')
  t.equal(response.type, DESTROY_BOOKMARK, 'It returns a type of DESTROY_BOOKMARK')
  t.equal(response.bookmarkID, 1, 'It returns the bookmark ID sent in as bookmarkID')
  t.end()
})

test('endOfBookmarks action', (t) => {
  const response = endOfBookmarks(true)

  t.ok(response, 'It returns something')
  t.equal(typeof response, 'object', 'It returns an object')
  t.equal(response.type, END_OF_BOOKMARKS, 'It returns a type of END_OF_BOOKMARKS')
  t.equal(response.end, true, 'It returns whether or not there are any more bookmarks as end')
  t.end()
})

test('requestLoading action', (t) => {
  const response = requestLoading()

  t.ok(response, 'It returns something')
  t.equal(typeof response, 'object', 'It returns an object')
  t.equal(response.type, REQUEST_LOADING, 'It returns a type of REQUEST_LOADING')
  t.end()
})

test('requestFinished action', (t) => {
  const response = requestFinished()

  t.ok(response, 'It returns something')
  t.equal(typeof response, 'object', 'It returns an object')
  t.equal(response.type, REQUEST_FINISHED, 'It returns a type of REQUEST_FINISHED')
  t.end()
})

test('setSearchTerm action', (t) => {
  const response = setSearchTerm('test')

  t.ok(response, 'It returns something')
  t.equal(typeof response, 'object', 'It returns an object')
  t.equal(response.type, SEARCH_TERM, 'It returns a type of SEARCH_TERM')
  t.equal(response.term, 'test', 'It returns the search term with the term key')
  t.end()
})

test('updateBookmarks action', (t) => {
  const bookmark = {
    id: 1,
    title: 'Test',
    url: 'http://google.com',
    createdOn: new Date()
  }
  const response = updateBookmarks([bookmark])

  t.ok(response, 'It returns something')
  t.equal(typeof response, 'object', 'It returns an object')
  t.equal(response.type, UPDATE_BOOKMARKS, 'It returns a type of UPDATE_BOOKMARKS')
  t.ok(Array.isArray(response.bookmarks), 'It returns an array of bookmarks sent in as bookmarks')
  t.equal(response.bookmarks[0], bookmark, 'It returns an array of bookmarks containing the bookmarks sent in')
  t.end()
})
