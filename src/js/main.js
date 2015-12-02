'use strict'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { IndexRoute, Route, Router } from 'react-router'
import { combineReducers, compose, createStore } from 'redux'
import { reduxReactRouter, routerStateReducer } from 'redux-router'
import { createHistory } from 'history'
import { bookmarks, networkState } from './helpers/reducers'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import io from 'socket.io-client'
import Bkmrkd from './containers/bkmrkd'
import Colophon from './components/colophon'
import Bookmarks from './components/bookmarks'

const routes = (
  <Route path='/' component={Bkmrkd}>
    <IndexRoute component={Bookmarks} />
    <Route path='/colophon' component={Colophon} />
  </Route>
)

if (typeof window !== 'undefined') {
  window.app.socket = io.connect(window.location.protocol + '//' + window.location.host)

  const reducer = combineReducers({
    router: routerStateReducer,
    bookmarks,
    networkState
  })
  const store = compose(
    reduxReactRouter({
      routes,
      createHistory
    })
  )(createStore)(reducer, window.app.__initialState || {})

  render(<Provider store={store}><Router history={createBrowserHistory()}>{ routes }</Router></Provider>, document.body.querySelector('[data-hook="app"]'))
}

export default routes

// socket.on('connect_error', () => {
//   showError('bkmrkd couldn\'nt connect to the server. You won\'t receive updates. You can try refreshing the page.', true)
// })
//
// socket.on('connect_timeout', () => {
//   showError('bkmrkd couldn\'nt connect to the server. You won\'t receive updates. You can try refreshing the page.', true)
// })
//
// socket.on('reconnecting', () => {
//   showError('Trying to reconnect to the bkrmrkd server...')
// })
//
// socket.on('reconnect', () => {
//   closeError()
// })
//
// socket.on('reconnect_error', () => {
//   showError('bkmrkd couldn\'nt connect to the server. You won\'t receive updates. You can try refreshing the page.', true)
// })
//
// socket.on('reconnect_failed', () => {
//   showError('bkmrkd couldn\'nt connect to the server. You won\'t receive updates. You can try refreshing the page.', true)
// })
//
// socket.on('error', data => {
//   showError(data.message, true)
// })
//
// socket.on('bookmarks', data => {
//   ReactDOM.render(<Bookmarks bookmarks={data.bookmarks} socket={socket}/>, document.querySelector('[data-hook="bookmarks"]'))
// })
