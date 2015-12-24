import React, { Component } from 'react'
import history from '../helpers/history'

export class SearchForm extends Component {
  constructor (props) {
    super(props)
  }

  handleSubmit (evt) {
    evt.preventDefault()

    const term = evt.target.value

    history.replaceState(null, `/search?term=${term}`)
  }

  render () {
    return (
      <form className='form search-form'
        action='/search'
        method='GET'
        role='form'
        onSubmit={this.handleSubmit}>
        <label htmlFor='search-term'>Search</label>
        <input type='search' name='term' id='search-term' />
      </form>
    )
  }
}
