import { combineReducers } from 'redux'
import { ADD_BOOKMARK, APPEND_BOOKMARKS, ADD_TOAST, CHANGE_PAGE, DESTROY_BOOKMARK, REQUEST_LOADING, REQUEST_FINISHED } from './actionTypes'

export default combineReducers({
  bookmarks,
  networkState
})

export function bookmarks (state = [], action) {
  switch (action.type) {
    case ADD_BOOKMARK:
      return [
        action.bookmark,
        ...state
      ]
    case APPEND_BOOKMARKS:
      return [
        ...state,
        action.bookmarks
      ]
    case DESTROY_BOOKMARK:
      let bookmarkIdx = -1

      state.forEach((bookmark, idx) => {
        if (bookmark.id === action.bookmarkID) {
          bookmarkIdx = idx
        }
      })

      if (bookmarkIdx === -1) {
        return state
      }

      return [
        ...state.slice(0, bookmarkIdx),
        ...state.slice(bookmarkIdx + 1)
      ]
    default:
      return state
  }
}

export function networkState (state = '', action) {
  switch (action.type) {
    case REQUEST_LOADING:
      return 'LOADING'
    case REQUEST_FINISHED:
      return ''
    default:
      return state
  }
}

export function page (state = 1, action) {
  switch (action.type) {
    case CHANGE_PAGE:
      return page
    default:
      return state
  }
}

export function toaster (state = [], action) {
  switch (action.type) {
    case ADD_TOAST:
      return [
        ...state,
        {
          style: action.style,
          message: action.message
        }
      ]
    default:
      return state
  }
}
