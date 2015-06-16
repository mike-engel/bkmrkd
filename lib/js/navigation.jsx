'use strict'

import React from 'react'

export var navigation = React.createClass({
  propTypes: {
    page: React.PropTypes.string
  },
  render: function () {
    let bkmrkClassString = this.props.page === 'bkmrks' ? 'active' : ''
    let colophonClassString = this.props.page === 'colophon' ? 'active' : ''

    return (
      <nav>
        <ul>
          <li>
            <a href='/' className={bkmrkClassString}>Bkmrks</a>
          </li>
          <li>
            <a href='/colophon' className={colophonClassString}>Colophon</a>
          </li>
        </ul>
      </nav>
    )
  }
})
