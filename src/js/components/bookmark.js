'use strict'

import React, { Component, PropTypes } from 'react'
import url from 'url'
import unescape from 'lodash.unescape'

export default class Bookmark extends Component {
  static propTypes = {
    bookmark: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props)
  };

  destroyBookmark (evt) {
    evt.preventDefault()

    if (typeof window !== 'undefined') {
      window.app.socket.emit('destroy-bookmark', {
        id: this.props.bookmark.id
      })
    }
  };

  getTimeString () {
    const months = {
      0: 'January',
      1: 'February',
      2: 'March',
      3: 'April',
      4: 'May',
      5: 'June',
      6: 'July',
      7: 'August',
      8: 'September',
      9: 'October',
      10: 'November',
      11: 'December'
    }
    const date = new Date(this.props.bookmark.createdOn)
    const month = months[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()

    return `${month} ${day}, ${year}`
  };

  getWebsite () {
    const bookmarkURL = this.props.bookmark.url

    let rootUrl = bookmarkURL
    let name = url.parse(bookmarkURL).hostname

    return {
      name: name,
      url: rootUrl
    }
  };

  render () {
    return (
      <li>
        <a href={this.props.bookmark.url} target='_blank'>
          <h2 className='bookmark-name'>{unescape(this.props.bookmark.title)}</h2>
        </a>
        <span className='date'>{this.getTimeString()}</span>
        <a href={this.getWebsite().url} target='_blank' className='website'>{this.getWebsite().name}</a>
        <a href={'/api/destroy/' + this.props.bookmark.id} onClick={this.destroyBookmark.bind(this)} className='destroy'>destroy</a>
      </li>
    )
  };
}
