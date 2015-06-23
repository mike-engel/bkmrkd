/* global socket */

'use strict'

import React from 'react'

export default React.createClass({
  propTypes: {
    bookmark: React.PropTypes.object,
    removeHelper: React.PropTypes.func
  },
  destroyBookmark: function (evt) {
    evt.preventDefault()

    socket.on('bookmark-destroyed', (data) => {
      this.props.removeHelper(data.id)
    })

    socket.emit('destroy-bookmark', {
      id: this.props.bookmark.id
    })
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
    let url = this.props.bookmark.url

    url.replace(/https\:\/\/|http\:\/\//, '')
    url.replace(/www/, '')

    if (url.indexOf('/') > 0) {
      url = url.subStr(0, url.indexOf('/'))
    }

    return url
  },
  render: function () {
    return (
      <li>
        <a href={this.props.bookmark.url}>
          <h2 className='bookmark-name'>{this.props.bookmark.title}</h2>
        </a>
        <span className='date'>{this.getTimeString()}</span>
        <a href={this.getWebsite()} className='website'>{this.getWebsite()}</a>
        <a href={'/api/destroy/' + this.props.bookmark.id} onClick={this.destroyBookmark}>Destroy</a>
      </li>
    )
  }
})
