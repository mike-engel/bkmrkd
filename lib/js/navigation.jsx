'use strict'

import React from 'react'

export default React.createClass({
  propTypes: {
    page: React.PropTypes.string
  },
  getInitialState: function () {
    return {
      page: this.props.page
    }
  },
  navigateTabs: function (evt) {
    evt = evt || window.event

    evt.preventDefault()

    this.changeTabs()
    window.history.pushState({
      page: this.state.page
    }, null, evt.target.href)
  },
  changeTabs: function () {
    let bookmarks = document.querySelector('[data-hook="bookmarks"]')
    let colophon = document.querySelector('[data-hook="colophon"]')

    if (this.state.page === '') {
      bookmarks.classList.remove('active')
      colophon.classList.add('active')
      window.document.title = 'Colophon – bkmrkd'
      this.setState({
        page: 'colophon'
      })
    } else {
      colophon.classList.remove('active')
      bookmarks.classList.add('active')
      window.document.title = 'bkmrkd'
      this.setState({
        page: ''
      })
    }
  },
  componentWillMount: function () {
    window.addEventListener('popstate', function (evt) {
      evt = evt || window.event

      this.changeTabs()
    }.bind(this))
  },
  render: function () {
    let bkmrkClassString = this.state.page === '' ? 'active' : ''
    let colophonClassString = this.state.page === 'colophon' ? 'active' : ''

    return (
      <ul>
        <li className={bkmrkClassString}>
          <a href='/' onClick={this.navigateTabs}>bkmrks</a>
        </li>
        <li className={colophonClassString}>
          <a href='/colophon' onClick={this.navigateTabs}>colophon</a>
        </li>
        <li>
          <a href='javascript:void(0);'>bookmarklet</a>
        </li>
      </ul>
    )
  }
})
