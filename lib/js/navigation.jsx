'use strict'

import React from 'react'

export default React.createClass({
  propTypes: {
    page: React.PropTypes.string
  },
  render: function () {
    let bkmrkClassString = this.props.page === '' ? 'active' : ''
    let colophonClassString = this.props.page === 'colophon' ? 'active' : ''

    return (
      <nav>
        <ul>
          <li className={bkmrkClassString}>
            <a href='/'>Bkmrks</a>
          </li>
          <li className={colophonClassString}>
            <a href='/colophon'>Colophon</a>
          </li>
        </ul>
      </nav>
    )
  }
})
