'use strict'

import React, { createClass, PropTypes } from 'react'
import { connect } from 'react-redux'
import Bookmark from './bookmark'
import { addBookmarks } from '../helpers/actions'

export const bookmarks = createClass({
  propTypes: {
    bookmarks: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    socket: PropTypes.object
  },
  getInitialState: function () {
    return {
      page: 1,
      endOfBookmarks: this.props.bookmarks ? this.props.bookmarks.length < 25 : true,
      requesting: false
    }
  },
  handleScrollEvent: function (evt) {
    evt = evt || window.event

    if (window.pageYOffset >= (document.body.offsetHeight - window.innerHeight - 250)) {
      this.getMoreBookmarks()
    }
  },
  getMoreBookmarks: function () {
    // if (!this.state.endOfBookmarks && !this.state.requesting) {
    //   this.setState({
    //     requesting: true
    //   })
    //
    //   this.props.socket.emit('get-bookmarks', {
    //     page: this.state.page + 1
    //   })
    // }
    //
    // this.props.socket.on('old-bookmarks', (data) => {
    //   if (data.bookmarks && this.state.bookmarks.indexOf(data.bookmarks[0] === -1)) {
    //     this.setState({
    //       bookmarks: update(this.state.bookmarks, {$push: data.bookmarks}),
    //       page: this.state.page + 1
    //     })
    //   } else if (data.message) {
    //     if (!document.body.querySelector('.no-bookmarks')) {
    //       let noBookmarksMessage = document.createElement('p')
    //
    //       noBookmarksMessage.classList.add('no-bookmarks')
    //       noBookmarksMessage.textContent = data.message
    //
    //       document.body.querySelector('[data-hook="bookmarks"]').appendChild(noBookmarksMessage)
    //     }
    //
    //     this.setState({
    //       endOfBookmarks: true
    //     })
    //
    //     window.removeEventListener('scroll', this.handleScrollEvent)
    //   }
    //
    //   this.setState({
    //     requesting: false
    //   })
    // })
  },
  render: function () {
    if (typeof window !== 'undefined') {
      if (!this.state.endOfBookmarks && this.state.page === 1) {
        window.addEventListener('scroll', this.handleScrollEvent)
      }

      window.app.socket.on('new-bookmark', data => {
        this.props.dispatch(addBookmarks(data.bookmark))
      })
    }

    if (this.props.bookmarks.length) {
      return (
        <ul className='bookmarks'>
          {this.props.bookmarks.sort((a, b) => {
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
            return <Bookmark key={bookmark.id} bookmark={bookmark} dispatch={this.props.dispatch} />
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

export default connect((state) => {
  return {
    bookmarks: state.bookmarks
  }
})(bookmarks)
