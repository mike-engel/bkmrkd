import React, { createClass, PropTypes } from 'react'
import Toast from '../components/toast'

export default createClass({
  propTypes: {
    toasts: PropTypes.array.isRequired
  },
  render: function () {
    return (
      <div className='toaster'>
        {this.props.toasts.map((data, idx) => {
          return <Toast key={idx} data={data} />
        })}
      </div>
    )
  }
})
