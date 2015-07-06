'use strict'

import React from 'react'
import Bookmarks from './bookmarks.jsx'
import Navigation from './navigation.jsx'
import io from 'socket.io-client'

let socket = io.connect(window.location.protocol + '//' + window.location.host)

window.closeError = function closeError () {
  let el = document.querySelector('.alert')

  if (!el) {
    return
  }

  el.classList.remove('visible')

  el.querySelector('span').removeEventListener('click', window.closeError)

  setTimeout(() => {
    document.body.removeChild(el)
  }, 200)
}

window.showError = function showError (message, actionable) {
  let el = document.createElement('div')

  window.closeError()

  el.textContent = message
  el.classList.add('alert')

  if (actionable) {
    let actionEl = document.createElement('span')

    actionEl.textContent = 'Close'

    el.insertBefore(actionEl, el.childNodes[0])

    actionEl.addEventListener('click', window.closeError)
  }

  document.body.insertBefore(el, document.body.children[0])

  el.classList.add('visible')

  if (!actionable) {
    setTimeout(() => {
      window.closeError()
    }, 5000)
  }
}

React.render(<Navigation page={window.location.pathname.substr(1)}/>, document.querySelector('[data-hook="main-nav"]'))

socket.on('connect_error', () => {
  window.showError('bkmrkd couldn\'nt connect to the server. You won\'t receive updates. You can try refreshing the page.', true)
})

socket.on('connect_timeout', () => {
  window.showError('bkmrkd couldn\'nt connect to the server. You won\'t receive updates. You can try refreshing the page.', true)
})

socket.on('reconnecting', () => {
  window.showError('Trying to reconnect to the bkrmrkd server...')
})

socket.on('reconnect', () => {
  window.window.closeError()
})

socket.on('reconnect_error', () => {
  window.showError('bkmrkd couldn\'nt connect to the server. You won\'t receive updates. You can try refreshing the page.', true)
})

socket.on('reconnect_failed', () => {
  window.showError('bkmrkd couldn\'nt connect to the server. You won\'t receive updates. You can try refreshing the page.', true)
})

socket.on('bookmarks', data => {
  React.render(<Bookmarks bookmarks={data.bookmarks} socket={socket}/>, document.querySelector('[data-hook="bookmarks"]'))
})
