'use strict'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { IndexRoute, Route, Router, browserHistory } from 'react-router'
import { combineReducers, compose, createStore } from 'redux'
import { reduxReactRouter, routerStateReducer } from 'redux-router'
import { bookmarks, endOfBookmarks, networkState, page, searchTerm, toaster } from './helpers/reducers'
import { createHistory } from 'history'
import io from 'socket.io-client'
import Bkmrkd from './containers/bkmrkd'
import Colophon from './components/colophon'
import Bookmarks from './components/bookmarks'
import { addToast } from './helpers/actions'
import Search from './components/search'

const routes = (
  <Route path='/' component={Bkmrkd}>
    <IndexRoute component={Bookmarks} />
    <Route path='/colophon' component={Colophon} />
    <Route path='/search' component={Search} />
  </Route>
)

if (typeof window !== 'undefined') {
  window.app.socket = io.connect(window.location.protocol + '//' + window.location.host)

  window.app.__initialState = window.app.__initialState || {
    bookmarks: [],
    networkState: '',
    toaster: [],
    page: 1,
    endOfBookmarks: false,
    searchTerm: ''
  }

  const reducer = combineReducers({
    router: routerStateReducer,
    bookmarks,
    networkState,
    toaster,
    page,
    endOfBookmarks,
    searchTerm
  })
  const store = compose(
    reduxReactRouter({
      routes,
      createHistory
    })
  )(createStore)(reducer, window.app.__initialState)

  window.app.socket.on('connect_error', () => {
    store.dispatch(addToast({
      message: 'bkmrkd couldn\'nt connect to the server. You won\'t receive updates. You can try refreshing the page.',
      style: 'error'
    }))
  })

  window.app.socket.on('connect_timeout', () => {
    store.dispatch(addToast({
      message: 'bkmrkd couldn\'nt connect to the server. You won\'t receive updates. You can try refreshing the page.',
      style: 'error'
    }))
  })

  window.app.socket.on('reconnecting', () => {
    store.dispatch(addToast({
      message: 'Trying to reconnect to the bkrmrkd server...',
      style: 'warning'
    }))
  })

  window.app.socket.on('reconnect', () => {
    store.dispatch(addToast({
      message: 'Reconnected to the bkmrkd server',
      style: 'success'
    }))
  })

  window.app.socket.on('reconnect_error', () => {
    store.dispatch(addToast({
      message: 'bkmrkd couldn\'nt connect to the server. You won\'t receive updates. You can try refreshing the page.',
      style: 'error'
    }))
  })

  window.app.socket.on('reconnect_failed', () => {
    store.dispatch(addToast({
      message: 'bkmrkd couldn\'nt connect to the server. You won\'t receive updates. You can try refreshing the page.',
      style: 'error'
    }))
  })

  window.app.socket.on('error', (data) => {
    store.dispatch(addToast({
      message: `Socket error: ${data.message}`,
      style: 'error'
    }))
  })

  render(<Provider store={store}><Router history={browserHistory}>{routes}</Router></Provider>, document.body.querySelector('[data-hook="app"]'))
}

export default routes
