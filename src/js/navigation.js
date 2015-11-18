'use strict'

import React, { Component } from 'react'
import snippet from './snippet'

export class Navigation extends Component {
  static propTypes = {
    page: React.PropTypes.string
  }

  constructor (props) {
    super(props)

    this.state = {
      page: this.props.page
    }
  }

  navigateTabs (evt) {
    evt = evt || window.event

    evt.preventDefault()

    this.changeTabs()
    window.history.pushState({
      page: this.state.page
    }, null, evt.target.href)
  }

  changeTabs () {
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
  }

  componentWillMount () {
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', function (evt) {
        evt = evt || window.event

        this.changeTabs()
      }.bind(this))
    }
  }

  render () {
    const bkmrkClassString = this.state.page === '' ? 'active' : ''
    const colophonClassString = this.state.page === 'colophon' ? 'active' : ''

    return (
      <ul>
        <li className={bkmrkClassString}>
          <a href='/' onClick={this.navigateTabs}>bkmrks</a>
        </li>
        <li className={colophonClassString}>
          <a href='/colophon' onClick={this.navigateTabs}>colophon</a>
        </li>
        <li>
          <a href={snippet}>bookmarklet</a>
        </li>
      </ul>
    )
  }
}
