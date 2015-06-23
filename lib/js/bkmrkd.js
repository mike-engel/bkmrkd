/* global io */

'use strict'

import React from 'react'
import Bookmarks from './bookmarks.jsx'
import Navigation from './navigation.jsx'

window.socket = io.connect(window.location.protocol + '//' + window.location.host)

React.render(<Navigation page={window.location.pathname.substr(1)}/>, document.querySelector('[data-hook="main-nav"]'))

window.socket.on('bookmarks', data => {
  React.render(<Bookmarks bookmarks={data.bookmarks}/>, document.querySelector('[data-hook="main-content"]'))
})
