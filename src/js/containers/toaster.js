import React, { PropTypes } from 'react'
import Toast from '../components/toast'

export function Toaster (props) {
  return (
    <div className='toaster'>
      {props.toasts.map((data, idx) => {
        return <Toast key={idx} data={data} />
      })}
    </div>
  )
}

Toaster.propTypes = {
  toasts: PropTypes.array.isRequired
}

export default Toaster
