import React, { createClass, PropTypes } from 'react'
import toast from '../components/toast'

export default createClass({
  propTypes: {
    alerts: PropTypes.object.isRequired
  },
  render: function () {
    return (
      <div className='toaster'>
        {this.props.alerts.map((data) => {
          return <toast data={data} />
        })}
      </div>
    )
  }
})
