import React, { Component, PropTypes } from 'react'
import { setSearchTerm } from '../helpers/actions'

export class SearchForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    searchTerm: PropTypes.string
  };

  handleSubmit (evt) {
    evt.preventDefault()

    const term = evt.target.querySelector('#search-term').value

    this.props.dispatch(setSearchTerm(term))

    this.props.history.push(`/search?term=${term}`)
  };

  render () {
    return (
      <form className='form search-form'
        action='search'
        method='GET'
        role='form'
        onSubmit={this.handleSubmit.bind(this)}>
        <label htmlFor='search-term'>Search</label>
        <input type='search' name='term' id='search-term' placeholder={this.props.searchTerm || 'search'} />
      </form>
    )
  };
}
