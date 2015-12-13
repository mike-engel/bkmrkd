import React, { createClass, PropTypes } from 'react'

export default createClass({
  propTypes: {
    data: PropTypes.object.isRequired
  },
  render: function () {
    return (
      <div className={`toast toast--${this.props.data.style}`}>
        <p className='toast__message'>{this.props.data.message}</p>
      </div>
    )
  }
})
