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
      socket: this.props.socket,
      page: 1,
      endOfBookmarks: this.props.bookmarks.length < 25,
      requesting: false
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
  handleScrollEvent: function (evt) {
    evt = evt || window.event

    if (window.pageYOffset >= (document.body.offsetHeight - window.innerHeight - 250)) {
      this.getMoreBookmarks()
    }
  },
  getMoreBookmarks: function () {
    if (!this.state.endOfBookmarks && !this.state.requesting) {
      this.setState({
        requesting: true
      })

      this.state.socket.emit('get-bookmarks', {
        page: this.state.page + 1
      })
    }

    this.state.socket.on('old-bookmarks', (data) => {
      if (data.bookmarks && this.state.bookmarks.indexOf(data.bookmarks[0] === -1)) {
        this.setState({
          bookmarks: update(this.state.bookmarks, {$push: data.bookmarks}),
          page: this.state.page + 1
        })
      } else if (data.message) {
        if (!document.body.querySelector('.no-bookmarks')) {
          let noBookmarksMessage = document.createElement('p')

          noBookmarksMessage.classList.add('no-bookmarks')
          noBookmarksMessage.textContent = data.message

          document.body.querySelector('[data-hook="bookmarks"]').appendChild(noBookmarksMessage)
        }

        this.setState({
          endOfBookmarks: true
        })

        window.removeEventListener('scroll', this.handleScrollEvent)
      }

      this.setState({
        requesting: false
      })
    })
  },
  render: function () {
    if (this.state.socket.on) {
      this.state.socket.on('new-bookmark', (data) => {
        this.addNewBookmark(data.bookmark)
      })
    }

    if (typeof window !== 'undefined' && !this.state.endOfBookmarks && this.state.page === 1) {
      window.addEventListener('scroll', this.handleScrollEvent)
    }

    if (this.state.bookmarks.length) {
      return (
        <ul className='bookmarks'>
          {this.state.bookmarks.sort((a, b) => {
            const dateA = new Date(a.createdOn)
            const dateB = new Date(b.createdOn)

            if (dateA < dateB) {
              return 1
            } else if (dateA > dateB) {
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
        <h2 className='h2'>No bookmarks yet! Place the script in your bookmarks bar and start bookmarking!</h2>
      )
    }
  }
})
