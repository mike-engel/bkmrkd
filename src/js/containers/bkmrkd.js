import React from 'react'
import { IndexLink, Link } from 'react-router'
import snippet from './snippet'

export default (props) => {
  return (
    <div className='app container'>
      <header className='main-nav'>
        <h1 className='h1'>bkmrkd</h1>
        <nav>
          <ul>
            <li><IndexLink activeClassName='active'>bkmrks</IndexLink></li>
            <li><Link to='/colophon' activeClassName='active'>colophon</Link></li>
            <li><Link to={snippet}>bookmaarklet</Link></li>
          </ul>
        </nav>
      </header>
      { this.props.children }
    </div>
  )
}
