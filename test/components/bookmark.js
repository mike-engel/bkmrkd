import React from 'react'
import test from 'tape'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import Bookmark from '../../src/js/components/bookmark'

test('bookmark component', (t) => {
  sinon.spy(Bookmark.prototype.__reactAutoBindMap, 'getTimeString')
  sinon.spy(Bookmark.prototype.__reactAutoBindMap, 'getWebsite')
  sinon.spy(Bookmark.prototype.__reactAutoBindMap, 'destroyBookmark')

  const bookmark = {
    id: 1,
    title: 'Test bookmark',
    url: 'https://duckduckgo.com',
    createdOn: '2015-01-01T12:00:00-00:00'
  }
  const markup = shallow(<Bookmark bookmark={bookmark} dispatch={() => {}} />)
  const destroyLink = markup.find('a.destroy')

  t.ok(markup.children().length, 'It renders the bookmark')
  t.ok(Bookmark.prototype.__reactAutoBindMap.getTimeString.called, 'It called getTimeString at least once')
  t.ok(Bookmark.prototype.__reactAutoBindMap.getWebsite.called, 'It called getWebsite at least once')

  destroyLink.simulate('click', {
    preventDefault: sinon.spy()
  })

  t.ok(Bookmark.prototype.__reactAutoBindMap.destroyBookmark.called, 'It calls destroyBookmark when clicked')

  t.equal(markup.instance().getTimeString(), 'January 1, 2015', 'It renders the correct time string using the props')

  t.equal(markup.instance().getWebsite().name, 'duckduckgo.com', 'It returns the short name of the website')
  t.equal(markup.instance().getWebsite().url, 'https://duckduckgo.com', 'It returns the full url of the website')
  t.end()
})
