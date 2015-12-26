import React from 'react'
import test from 'tape'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import { Search } from '../../../src/js/components/search'

test('search component', (t) => {
  const dispatch = sinon.spy()
  const noBookmarks = []
  const bookmarks = [
    {
      id: 1,
      title: 'Test',
      url: 'https://duckduckgo.com',
      createdOn: new Date('2015-01-01T12:00:00-00:00')
    }
  ]
  const networkState = ''

  let markup = shallow(<Search bookmarks={noBookmarks} dispatch={dispatch} networkState={networkState} searchTerm='test' />)

  t.ok(markup.children().length, 'It renders the Search component')
  t.ok(markup.find('.h2').length, 'It renders the no results found message when no bookmarks are passed in')

  markup.setProps({
    bookmarks
  })

  t.ok(markup.find('ul').length, 'It renders the list of bookmarks')
  t.equal(markup.find('Bookmark').length, 1, 'It renders the one bookmark')
  t.end()
})
