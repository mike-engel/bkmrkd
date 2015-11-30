import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import { connect } from 'react-redux'
import snippet from '../helpers/snippet'

// function bkmrkd (props) {
class Bkmrkd extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor (props) {
    console.log(props)
    super(props)
  }

  render () {
    return (
      <div className='app container'>
        <header className='main-nav'>
          <h1 className='h1'>bkmrkd</h1>
          <nav>
            <ul>
              <li><IndexLink to='/' activeClassName='active'>bkmrkd</IndexLink></li>
              <li><Link to='/colophon' activeClassName='active'>colophon</Link></li>
              <li><Link to={snippet}>bookmaarklet</Link></li>
            </ul>
          </nav>
        </header>
        { this.props.children }
      </div>
    )
  }
}

export default connect((state) => ({
  bookmarks: state.bookmarks,
  networkState: state.networkState
}))(Bkmrkd)
