'use strict'

import React from 'react'
import url from 'url'
import unescape from 'lodash.unescape'

export default React.createClass({
  propTypes: {
    bookmark: React.PropTypes.object,
    removeHelper: React.PropTypes.func,
    socket: React.PropTypes.object
  },
  destroyBookmark: function (evt) {
    evt.preventDefault()

    if (this.props.socket.on) {
      this.props.socket.on('bookmark-destroyed', (data) => {
        this.props.removeHelper(data.id)
      })

      this.props.socket.emit('destroy-bookmark', {
        id: this.props.bookmark.id
      })
    }
  },
  getTimeString: function () {
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
  },
  getWebsite: function () {
    const bookmarkURL = this.props.bookmark.url

    let rootUrl = bookmarkURL
    let name = url.parse(bookmarkURL).hostname

    return {
      name: name,
      url: rootUrl
    }
  },
  render: function () {
    return (
      <li>
        <a href={this.props.bookmark.url} target='_blank'>
          <h2 className='bookmark-name'>{unescape(this.props.bookmark.title)}</h2>
        </a>
        <span className='date'>{this.getTimeString()}</span>
        <a href={this.getWebsite().url} target='_blank' className='website'>{this.getWebsite().name}</a>
        <a href={'/api/destroy/' + this.props.bookmark.id} onClick={this.destroyBookmark} className='destroy'>destroy</a>
      </li>
    )
  }
})
