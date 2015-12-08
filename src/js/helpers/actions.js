import { ADD_BOOKMARK, ADD_TOAST, CHANGE_PAGE, DESTROY_BOOKMARK, END_OF_BOOKMARKS, REQUEST_LOADING, REQUEST_FINISHED, UPDATE_BOOKMARKS } from './actionTypes'

export function addBookmark (bookmark) {
  return {
    type: ADD_BOOKMARK,
    bookmark
  }
}

export function addToast ({message, style}) {
  return {
    type: ADD_TOAST,
    message,
    style
  }
}

export function changePage (page) {
  return {
    type: CHANGE_PAGE,
    page
  }
}

export function destroyBookmark (bookmarkID) {
  return {
    type: DESTROY_BOOKMARK,
    bookmarkID
  }
}

export function endOfBookmarks (end) {
  return {
    type: END_OF_BOOKMARKS,
    end
  }
}

export function requestLoading () {
  return {
    type: REQUEST_LOADING
  }
}

export function requestFinished () {
  return {
    type: REQUEST_FINISHED
  }
}

export function updateBookmarks (bookmarks) {
  return {
    type: UPDATE_BOOKMARKS,
    bookmarks
  }
}
