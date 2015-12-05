import { ADD_BOOKMARK, ADD_TOAST, APPEND_BOOKMARKS, CHANGE_PAGE, DESTROY_BOOKMARK, REQUEST_LOADING, REQUEST_FINISHED } from './actionTypes'

export function destroyBookmark (bookmarkID) {
  return {
    type: DESTROY_BOOKMARK,
    bookmarkID
  }
}

export function addBookmark (bookmark) {
  return {
    type: ADD_BOOKMARK,
    bookmark
  }
}

export function appendBookmarks (bookmarks) {
  return {
    type: APPEND_BOOKMARKS,
    bookmarks
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
