import React, { PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import { connect } from 'react-redux'
import { SearchForm } from '../components/searchForm'
import snippet from '../helpers/snippet'

export function Bkmrkd (props) {
  return (
    <div className='app container'>
      <header className='main-nav'>
        <h1 className='h1'>bkmrkd</h1>
        <SearchForm dispatch={props.dispatch}
          history={props.history}
          searchTerm={props.searchTerm} />
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
  children: PropTypes.node,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  searchTerm: PropTypes.string
}

export default connect((state) => {
  return {
    dispatch: state.dispatch,
    searchTerm: state.searchTerm
  }
})(Bkmrkd)
