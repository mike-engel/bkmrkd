import { combineReducers } from 'redux'
import { ADD_BOOKMARKS, DESTROY_BOOKMARK, REQUEST_LOADING, REQUEST_SUCCESS, REQUEST_FAILURE } from './actionTypes'

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
      const idx = state.indexOf(action.bookmark)

      return [
        ...state.slice(0, idx),
        ...state.slice(idx + 1)
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
