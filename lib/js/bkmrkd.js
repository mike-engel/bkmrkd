'use strict'

import React from 'react'
import Bookmarks from './bookmarks.jsx'
import Navigation from './navigation.jsx'
import io from 'socket.io-client'
import snippet from './snippet'

let socket = io.connect(window.location.protocol + '//' + window.location.host)

function closeError () {
  let el = document.querySelector('.alert')

  if (!el) {
    return
  }

  el.classList.remove('visible')

  el.querySelector('span').removeEventListener('click', closeError)

  setTimeout(() => {
    document.body.removeChild(el)
  }, 200)
}

function showError (message, actionable) {
  let el = document.createElement('div')

  closeError()

  el.textContent = message
  el.classList.add('alert')

  if (actionable) {
    let actionEl = document.createElement('span')

    actionEl.textContent = 'Close'

    el.insertBefore(actionEl, el.childNodes[0])

    actionEl.addEventListener('click', closeError)
  }

  document.body.insertBefore(el, document.body.children[0])

  el.classList.add('visible')

  if (!actionable) {
    setTimeout(() => {
      closeError()
    }, 5000)
  }
}

document.querySelector('[data-hook="bookmarklet-url"]').setAttribute('href', snippet)

React.render(<Navigation page={window.location.pathname.substr(1)}/>, document.querySelector('[data-hook="main-nav"]'))

socket.on('connect_error', () => {
  showError('bkmrkd couldn\'nt connect to the server. You won\'t receive updates. You can try refreshing the page.', true)
})

socket.on('connect_timeout', () => {
  showError('bkmrkd couldn\'nt connect to the server. You won\'t receive updates. You can try refreshing the page.', true)
})

socket.on('reconnecting', () => {
  showError('Trying to reconnect to the bkrmrkd server...')
})

socket.on('reconnect', () => {
  closeError()
})

socket.on('reconnect_error', () => {
  showError('bkmrkd couldn\'nt connect to the server. You won\'t receive updates. You can try refreshing the page.', true)
})

socket.on('reconnect_failed', () => {
  showError('bkmrkd couldn\'nt connect to the server. You won\'t receive updates. You can try refreshing the page.', true)
})

socket.on('error', data => {
  showError(data.message, true)
})

socket.on('bookmarks', data => {
  React.render(<Bookmarks bookmarks={data.bookmarks} socket={socket}/>, document.querySelector('[data-hook="bookmarks"]'))
})
