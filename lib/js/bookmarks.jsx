'use strict'

import React from 'react/addons'
import Bookmark from './bookmark.jsx'

const update = React.addons.update

export default React.createClass({
  propTypes: {
    bookmarks: React.PropTypes.array,
    socket: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      bookmarks: this.props.bookmarks,
      socket: this.props.socket
    }
  },
  addNewBookmark: function (bookmark) {
    this.setState({
      bookmarks: update(this.state.bookmarks, {$push: [bookmark]})
    })
  },
  removeBookmark: function (id) {
    let index = 0

    this.state.bookmarks.forEach((bookmark, idx) => {
      if (bookmark.id === id) {
        index = idx
        return
      }
    })

    this.setState({
      bookmarks: update(this.state.bookmarks, {$splice: [[index, 1]]})
    })
  },
  render: function () {
    if (this.state.socket.on) {
      this.state.socket.on('new-bookmark', (data) => {
        this.addNewBookmark(data.bookmark)
      })
    }

    if (this.state.bookmarks.length) {
      return (
        <ul className='bookmarks'>
          {this.state.bookmarks.sort((a, b) => {
            if (a.createdOn < b.createdOn) {
              return 1
            } else if (a.createdOn > b.createdOn) {
              return -1
            } else {
              return 0
            }
          }).map((bookmark) => {
            const removeHelper = this.removeBookmark

            return <Bookmark key={bookmark.id} bookmark={bookmark} removeHelper={removeHelper} socket={this.state.socket}/>
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
