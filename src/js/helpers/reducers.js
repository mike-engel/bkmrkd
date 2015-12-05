import { combineReducers } from 'redux'
import { ADD_BOOKMARKS, DESTROY_BOOKMARK, REQUEST_LOADING, REQUEST_SUCCESS, REQUEST_FAILURE, ADD_TOAST } from './actionTypes'

export default combineReducers({
  bookmarks,
  networkState
})

export function bookmarks (state = [], action) {
  switch (action.type) {
    case ADD_BOOKMARKS:
      return [
        action.bookmarks,
        ...state
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

export function networkState (state = {}, action) {
  switch (action.type) {
    case REQUEST_LOADING:
      return {
        state: 'LOADING'
      }
    case REQUEST_SUCCESS:
      return {
        state: 'SUCCESS'
      }
    case REQUEST_FAILURE:
      return {
        state: 'FAILURE',
        error: action.message
      }
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
