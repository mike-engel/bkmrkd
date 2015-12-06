'use strict'

import React, { createClass, PropTypes } from 'react'
import { connect } from 'react-redux'
import Bookmark from './bookmark'
import { addBookmark, appendBookmarks, changePage, destroyBookmark, requestLoading, requestFinished } from '../helpers/actions'
import { REQUEST_LOADING } from '../helpers/actionTypes'

export const bookmarks = createClass({
  propTypes: {
    bookmarks: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    networkState: PropTypes.string.isRequired,
    page: PropTypes.number.isRequired,
    location: PropTypes.object
  },
  handleScrollEvent: function (evt) {
    evt = evt || window.event

    if (window.pageYOffset >= (document.body.offsetHeight - window.innerHeight - 250)) {
      this.getMoreBookmarks()
    }
  },
  getMoreBookmarks: function () {
    if (this.props.bookmarks.length % 25 !== 0 && this.props.networkState !== REQUEST_LOADING) {
      this.props.dispatch(requestLoading())

      window.app.socket.emit('get-bookmarks', {
        page: this.props.page
      })

      window.app.socket.on('old-bookmarks', (data) => {
        this.props.dispatch(requestFinished())
        this.props.dispatch(appendBookmarks(data.bookmarks))
        this.props.dispatch(changePage(this.props.page + 1))

        if (data.bookmarks.length % 25 !== 0) {
          window.removeEventListener('scroll', this.handleScrollEvent)
        }
      })
    }
  },
  endOfBookmarks: function () {
    if (this.props.bookmarks.length % 25 !== 0) {
      return (
        <div className='no-more-bookmarks'>
          <p classsName='h2'>All out of bookmarks!</p>
        </div>
      )
    }
  },
  render: function () {
    console.log('page: ', this.props.location.query.page)

    if (typeof window !== 'undefined') {
      if (this.props.bookmarks.length === 25) {
        window.addEventListener('scroll', this.handleScrollEvent)
      }

      window.app.socket.on('new-bookmark', data => {
        this.props.dispatch(addBookmark(data.bookmark))
      })

      window.app.socket.on('bookmark-destroyed', (data) => {
        this.props.dispatch(destroyBookmark(data.id))
      })
    }

    if (this.props.bookmarks.length) {
      return (
        <section className='bookmarks'>
          <ul>
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
          {this.endOfBookmarks()}
        </section>
      )
    } else {
      return (
        <h2 className='h2'>No bookmarks yet! Place the script in your bookmarks bar and start bookmarking.</h2>
      )
    }
  }
})

export default connect((state) => {
  return {
    bookmarks: state.bookmarks,
    networkState: state.networkState,
    page: state.page
  }
})(bookmarks)
