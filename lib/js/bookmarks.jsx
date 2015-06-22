/* global socket */

'use strict'

import React from 'react'
import Bookmark from './bookmark.jsx'

export default React.createClass({
  propTypes: {
    bookmarks: React.PropTypes.array
  },
  getInitialState: function () {
    return {
      bookmarks: this.props.bookmarks
    }
  },
  addNewBookmark: function (bookmark) {
    console.log('new bookmark: ', bookmark)

    this.setState({
      bookmarks: [bookmark].concat(this.state.bookmarks)
    })
  },
  render: function () {
    socket.on('new-bookmark', (data) => {
      console.log(this)
      this.addNewBookmark(data.bookmark)
    })

    if (this.state.bookmarks.length) {
      return (
        <ul className='bookmarks'>
          {this.state.bookmarks.map(function (bookmark) {
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
