import { createStore, compose, combineReducers } from 'redux'
import { routerStateReducer } from 'redux-router'
import { reduxReactRouter } from 'redux-router/server'
import { bookmarks, endOfBookmarks, networkState, page, searchTerm, toaster } from '../src/js/helpers/reducers'
import bkmrkdRoutes from '../src/js/main'

export default function (initialState) {
  const reducer = combineReducers({
    router: routerStateReducer,
    bookmarks,
    endOfBookmarks,
    networkState,
    page,
    searchTerm,
    toaster
  })

  return compose(
    reduxReactRouter({
      routes: bkmrkdRoutes
    })
  )(createStore)(reducer, initialState)
}
