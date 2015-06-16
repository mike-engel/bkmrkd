'use strict'

import React from 'react'

export var bookmarks = React.createClass({
  render: function () {
    return (
      <ul className="bookmarks">
        {this.props.bookmarks.map(function (bookmark) {
          return <Bookmark bookmark={bookmark}/>
        })}
      </ul>
    )
  }
})
