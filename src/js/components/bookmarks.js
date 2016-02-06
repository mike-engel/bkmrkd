'use strict'

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Bookmark from './bookmark'
import { addBookmark, changePage, destroyBookmark, endOfBookmarks, requestLoading, requestFinished, updateBookmarks } from '../helpers/actions'
import { REQUEST_LOADING } from '../helpers/actionTypes'

export class Bookmarks extends Component {
  static propTypes = {
    bookmarks: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    networkState: PropTypes.string.isRequired,
    page: PropTypes.number.isRequired,
    endOfBookmarks: PropTypes.bool.isRequired
  };

  getMoreBookmarks (evt) {
    if (this.props.networkState !== REQUEST_LOADING) {
      let action
      let pageIncrementer = 0

      if (evt) {
        action = evt.target.getAttribute('data-hook')

        if (action === 'previous' && this.props.page !== 1) {
          pageIncrementer = -1
        } else if (action === 'next' && !this.props.endOfBookmarks) {
          pageIncrementer = 1
        }
      }

      this.props.dispatch(requestLoading())

      if (typeof window !== 'undefined') {
        window.app.socket.emit('get-bookmarks', {
          page: this.props.page + pageIncrementer
        })

        window.app.socket.on('old-bookmarks', (data) => {
          this.props.dispatch(requestFinished())
          this.props.dispatch(updateBookmarks(data.bookmarks))
          this.props.dispatch(changePage(this.props.page + pageIncrementer))
          this.props.dispatch(endOfBookmarks(data.endOfBookmarks))

          pageIncrementer = 0
        })
      }
    }
  };

  pagination () {
    return (
      <div className='pagination'>
        <Link to={this.props.page === 1 ? 'javascript:void(0)' : `/?page=${this.props.page - 1}`}
          className={this.props.page === 1 ? 'pagination__link disabled' : 'pagination__link'}
          onClick={this.props.page === 1 ? () => {} : this.getMoreBookmarks}
          disabled={this.props.page === 1}
          data-hook='previous'>
          &#x276e; Previous
        </Link>
        <Link to={this.props.endOfBookmarks ? 'javascript:void(0)' : `/?page=${this.props.page + 1}`}
          className={this.props.endOfBookmarks ? 'pagination__link disabled' : 'pagination__link'}
          onClick={this.props.endOfBookmarks ? () => {} : this.getMoreBookmarks}
          disabled={this.props.endOfBookmarks}
          data-hook='next'>
          Next &#x276f;
        </Link>
      </div>
    )
  };

  componentDidUpdate () {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  };

  componentWillMount () {
    this.getMoreBookmarks()
  };

  componentWillUnmount () {
    this.props.dispatch(changePage(1))
  };

  render () {
    if (typeof window !== 'undefined') {
      window.app.socket.on('new-bookmark', (data) => {
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
          {this.pagination()}
        </section>
      )
    } else {
      return (
        <section className='bookmarks'>
          <h2 className='h2'>No bookmarks yet! Place the script in your bookmarks bar and start bookmarking.</h2>
        </section>
      )
    }
  };
}

export default connect((state) => {
  return {
    bookmarks: state.bookmarks,
    networkState: state.networkState,
    page: state.page,
    endOfBookmarks: state.endOfBookmarks
  }
})(Bookmarks)
