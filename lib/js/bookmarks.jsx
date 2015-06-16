'use strict'

import React from 'react'
import Bookmark from './bookmark.jsx'

export var bookmarks = React.createClass({
  propTypes: {
    bookmarks: React.PropTypes.array
  },
  render: function () {
    return (
      <ul className='bookmarks'>
        {this.props.bookmarks.map(function (bookmark) {
          return <Bookmark bookmark={bookmark}/>
        })}
      </ul>
    )
  }
})
