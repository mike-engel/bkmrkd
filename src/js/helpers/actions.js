import { ADD_BOOKMARK, ADD_TOAST, APPEND_BOOKMARKS, DESTROY_BOOKMARK, REQUEST_LOADING, REQUEST_SUCCESS, REQUEST_FAILURE } from './actionTypes'

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

export function requestLoading () {
  return {
    type: REQUEST_LOADING
  }
}

export function requestSuccess () {
  return {
    type: REQUEST_SUCCESS
  }
}

export function requestFailure (message) {
  return {
    type: REQUEST_FAILURE,
    message
  }
}

export function addToast ({message, style}) {
  return {
    type: ADD_TOAST,
    message,
    style
  }
}
