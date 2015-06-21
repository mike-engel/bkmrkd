'use strict'

import React from 'react'
import Bookmark from './bookmark.jsx'

export default React.createClass({
  propTypes: {
    bookmarks: React.PropTypes.array
  },
  render: function () {
    if (this.props.bookmarks.length) {
      return (
        <ul className='bookmarks'>
          {this.props.bookmarks.map(function (bookmark) {
            return <Bookmark key={bookmark.id} bookmark={bookmark}/>
          })}
        </ul>
      )
    } else {
      return (
        <h2 className='h1'>No bookmarks yet! Place the script in your bookmarks bar and start bookmarking!</h2>
      )
    }
  }
})
