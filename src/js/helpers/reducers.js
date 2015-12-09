import { ADD_BOOKMARK, ADD_TOAST, CHANGE_PAGE, DESTROY_BOOKMARK, END_OF_BOOKMARKS, REQUEST_LOADING, REQUEST_FINISHED, UPDATE_BOOKMARKS } from './actionTypes'

export function bookmarks (state = [], action) {
  switch (action.type) {
    case ADD_BOOKMARK:
      return [
        action.bookmark,
        ...state
      ]
    case UPDATE_BOOKMARKS:
      return action.bookmarks
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

export function endOfBookmarks (state = false, action) {
  switch (action.type) {
    case END_OF_BOOKMARKS:
      return action.end
    default:
      return state
  }
}

export function networkState (state = '', action) {
  switch (action.type) {
    case REQUEST_LOADING:
      return REQUEST_LOADING
    case REQUEST_FINISHED:
      return ''
    default:
      return state
  }
}

export function page (state = 1, action) {
  switch (action.type) {
    case CHANGE_PAGE:
      return action.page
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
