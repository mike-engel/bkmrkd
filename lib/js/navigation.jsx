'use strict'

import React from 'react'

export var navigation = React.createClass({
  render: function() {
    let bkmrkClassString = this.props.page === 'bkmrks' ? 'active' : '',
      colophonClassString = this.props.page === 'colophon' ? 'active' : ''

    return (<nav>
        <ul>
          <li>
            <a href="/" class={bkmrkClassString}>Bkmrks</a>
          </li>
          <li>
            <a href="/colophon" class={colophonClassString}>Colophon</a>
          </li>
        </ul>
      </nav>
    )
  }
})
