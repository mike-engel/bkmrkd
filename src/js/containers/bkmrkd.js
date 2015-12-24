import React, { PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import { SearchForm } from '../components/searchForm'
import snippet from '../helpers/snippet'

export default function Bkmrkd (props) {
  return (
    <div className='app container'>
      <header className='main-nav'>
        <h1 className='h1'>bkmrkd</h1>
        <SearchForm />
        <nav>
          <ul>
            <li><IndexLink to='/' activeClassName='active'>bkmrkd</IndexLink></li>
            <li><Link to='/colophon' activeClassName='active'>colophon</Link></li>
            <li><Link to={snippet}>bookmarklet</Link></li>
          </ul>
        </nav>
      </header>
      { props.children }
    </div>
  )
}

Bkmrkd.propTypes = {
  children: PropTypes.node
}
