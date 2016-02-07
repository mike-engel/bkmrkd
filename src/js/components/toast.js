import React, { Component, PropTypes } from 'react'

export default class Toast extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  };

  render () {
    return (
      <div className={`toast toast--${this.props.data.style}`}>
        <p className='toast__message'>{this.props.data.message}</p>
      </div>
    )
  };
}
