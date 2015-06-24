/* global io */

'use strict'

import React from 'react'
import Bookmarks from './bookmarks.jsx'
import Navigation from './navigation.jsx'

let socket = io.connect(window.location.protocol + '//' + window.location.host)

React.render(<Navigation page={window.location.pathname.substr(1)}/>, document.querySelector('[data-hook="main-nav"]'))

socket.on('bookmarks', data => {
  React.render(<Bookmarks bookmarks={data.bookmarks} socket={socket}/>, document.querySelector('[data-hook="main-content"]'))
})
