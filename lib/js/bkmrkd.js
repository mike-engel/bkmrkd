'use strict'

import React from 'react'
// import Bookmarks from './bookmarks.jsx'
import Navigation from './navigation.jsx'

React.render(<Navigation page={window.location.pathname.substr(1)}/>, document.querySelector('[data-hook="main-nav"]'))
