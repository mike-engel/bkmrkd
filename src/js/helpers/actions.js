import { ADD_BOOKMARKS, DESTROY_BOOKMARK, REQUEST_LOADING, REQUEST_SUCCESS, REQUEST_FAILURE, ADD_TOAST } from './actionTypes'

export function destroyBookmark (bookmarkID) {
  return {
    type: DESTROY_BOOKMARK,
    bookmarkID
  }
}

export function addBookmarks (bookmarks) {
  return {
    type: ADD_BOOKMARKS,
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
