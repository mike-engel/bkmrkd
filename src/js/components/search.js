'use strict'

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Bookmark from './bookmark'
import { requestLoading, requestFinished, updateBookmarks } from '../helpers/actions'

export class Search extends Component {
  static propTypes = {
    bookmarks: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    networkState: PropTypes.string.isRequired,
    searchTerm: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props)
  };

  componentWillMount () {
    if (typeof window !== 'undefined') {
      this.props.dispatch(requestLoading())

      window.app.socket.emit('search', {
        term: this.props.searchTerm
      })

      window.app.socket.on('search-results', (data) => {
        this.props.dispatch(requestFinished())

        this.props.dispatch(updateBookmarks(data.bookmarks))
      })
    }
  };

  render () {
    if (this.props.bookmarks.length) {
      return (
        <section className='bookmarks search-results'>
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
        </section>
      )
    } else {
      return (
        <section className='bookmarks search-results'>
          <h2 className='h2'>Couldn't find anything for {this.props.searchTerm}.</h2>
        </section>
      )
    }
  };
}

export default connect((state) => {
  return {
    bookmarks: state.bookmarks,
    networkState: state.networkState,
    searchTerm: state.searchTerm
  }
})(Search)
