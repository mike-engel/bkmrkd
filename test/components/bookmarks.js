import React from 'react'
import test from 'tape'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import { bookmarks as Bookmarks } from '../../src/js/components/bookmarks'

test('bookmarks component with some bookmarks', (t) => {
  sinon.spy(Bookmarks.prototype.__reactAutoBindMap, 'getMoreBookmarks')
  sinon.spy(Bookmarks.prototype.__reactAutoBindMap, 'pagination')
  sinon.spy(Bookmarks.prototype, 'componentDidUpdate')

  const bookmarks = [
    {
      id: 1,
      title: 'Test bookmark 1',
      url: 'https://duckduckgo.com',
      createdOn: '2015-01-01T12:00:00-00:00'
    },
    {
      id: 2,
      title: 'Test bookmark 2',
      url: 'https://google.com',
      createdOn: '2015-01-02T12:00:00-00:00'
    },
    {
      id: 3,
      title: 'Test bookmark 3',
      url: 'https://nyt.com',
      createdOn: '2015-01-03T12:00:00-00:00'
    }
  ]
  const markup = shallow(<Bookmarks bookmarks={bookmarks}
    dispatch={() => {}}
    networkState=''
    page={1}
    endOfBookmarks={true} />) // eslint-disable-line

  t.ok(markup.children().length, 'It renders the bookmark')
  t.ok(Bookmarks.prototype.__reactAutoBindMap.pagination.called, 'It called pagination at least once')
  t.notOk(Bookmarks.prototype.__reactAutoBindMap.getMoreBookmarks.called, 'It didn\'t call getMoreBookmarks at least once')
  t.equal(Bookmarks.prototype.componentDidUpdate.callCount, 0, 'It didn\'t call componentDidUpdate yet')

  t.equal(markup.render().find('li').length, 3, 'It renders the three bookmarks as Bookmark components')
  t.equal(markup.render().find('li')[0].children[0].attribs.href, bookmarks[0].url, 'It renders the bookmarks by date')

  t.equal(markup.find('.pagination').length, 1, 'It renders the pagination links')
  t.equal(markup.find('.pagination__link.disabled').length, 2, 'It renders the disabled links')

  Bookmarks.prototype.__reactAutoBindMap.pagination.restore()
  Bookmarks.prototype.__reactAutoBindMap.getMoreBookmarks.restore()
  Bookmarks.prototype.componentDidUpdate.restore()

  t.end()
})

test('bookmarks component with no bookmarks', (t) => {
  sinon.spy(Bookmarks.prototype.__reactAutoBindMap, 'getMoreBookmarks')
  sinon.spy(Bookmarks.prototype.__reactAutoBindMap, 'pagination')
  sinon.spy(Bookmarks.prototype, 'componentDidUpdate')

  const bookmarks = []
  const markup = shallow(<Bookmarks bookmarks={bookmarks}
    dispatch={() => {}}
    networkState=''
    page={1}
    endOfBookmarks={true} />) // eslint-disable-line

  t.ok(markup.children().length, 'It renders the bookmark')
  t.notOk(Bookmarks.prototype.__reactAutoBindMap.pagination.called, 'It doesn\'t call pagination at least once')
  t.notOk(Bookmarks.prototype.__reactAutoBindMap.getMoreBookmarks.called, 'It didn\'t call getMoreBookmarks at least once')
  t.equal(Bookmarks.prototype.componentDidUpdate.callCount, 0, 'It didn\'t call componentDidUpdate yet')

  t.equal(markup.render().find('li').length, 0, 'It renders no Bookmark components')

  t.equal(markup.find('.pagination').length, 0, 'It doesn\'t render the pagination links')

  t.ok(markup.find('.no-bookmarks'), 'It renders the no bookmarks message')

  Bookmarks.prototype.__reactAutoBindMap.pagination.restore()
  Bookmarks.prototype.__reactAutoBindMap.getMoreBookmarks.restore()
  Bookmarks.prototype.componentDidUpdate.restore()

  t.end()
})

test('bookmarks component with a lot of bookmarks', (t) => {
  sinon.stub(Bookmarks.prototype.__reactAutoBindMap, 'getMoreBookmarks')

  const bookmarks = [
    {
      id: 1,
      title: 'Test bookmark 1',
      url: 'https://duckduckgo.com',
      createdOn: '2015-01-01T12:00:00-00:00'
    },
    {
      id: 2,
      title: 'Test bookmark 2',
      url: 'https://google.com',
      createdOn: '2015-01-02T12:00:00-00:00'
    },
    {
      id: 3,
      title: 'Test bookmark 3',
      url: 'https://nyt.com',
      createdOn: '2015-01-03T12:00:00-00:00'
    },
    {
      id: 4,
      title: 'Test bookmark 4',
      url: 'https://duckduckgo.com',
      createdOn: '2015-01-01T12:00:00-00:00'
    },
    {
      id: 5,
      title: 'Test bookmark 5',
      url: 'https://google.com',
      createdOn: '2015-01-02T12:00:00-00:00'
    },
    {
      id: 6,
      title: 'Test bookmark 6',
      url: 'https://nyt.com',
      createdOn: '2015-01-03T12:00:00-00:00'
    },
    {
      id: 7,
      title: 'Test bookmark 7',
      url: 'https://duckduckgo.com',
      createdOn: '2015-01-07T12:00:00-00:00'
    },
    {
      id: 8,
      title: 'Test bookmark 8',
      url: 'https://google.com',
      createdOn: '2015-01-08T12:00:00-00:00'
    },
    {
      id: 9,
      title: 'Test bookmark 9',
      url: 'https://nyt.com',
      createdOn: '2015-01-09T12:00:00-00:00'
    },
    {
      id: 10,
      title: 'Test bookmark 10',
      url: 'https://duckduckgo.com',
      createdOn: '2015-01-010T12:00:00-00:00'
    },
    {
      id: 11,
      title: 'Test bookmark 11',
      url: 'https://google.com',
      createdOn: '2015-01-011T12:00:00-00:00'
    },
    {
      id: 12,
      title: 'Test bookmark 12',
      url: 'https://nyt.com',
      createdOn: '2015-01-012T12:00:00-00:00'
    },
    {
      id: 13,
      title: 'Test bookmark 13',
      url: 'https://duckduckgo.com',
      createdOn: '2015-01-013T12:00:00-00:00'
    },
    {
      id: 14,
      title: 'Test bookmark 14',
      url: 'https://google.com',
      createdOn: '2015-01-014T12:00:00-00:00'
    },
    {
      id: 15,
      title: 'Test bookmark 15',
      url: 'https://nyt.com',
      createdOn: '2015-01-015T12:00:00-00:00'
    },
    {
      id: 16,
      title: 'Test bookmark 16',
      url: 'https://duckduckgo.com',
      createdOn: '2015-01-016T12:00:00-00:00'
    },
    {
      id: 17,
      title: 'Test bookmark 17',
      url: 'https://google.com',
      createdOn: '2015-01-017T12:00:00-00:00'
    },
    {
      id: 18,
      title: 'Test bookmark 18',
      url: 'https://nyt.com',
      createdOn: '2015-01-018T12:00:00-00:00'
    },
    {
      id: 19,
      title: 'Test bookmark 19',
      url: 'https://duckduckgo.com',
      createdOn: '2015-01-019T12:00:00-00:00'
    },
    {
      id: 20,
      title: 'Test bookmark 20',
      url: 'https://google.com',
      createdOn: '2015-01-020T12:00:00-00:00'
    },
    {
      id: 21,
      title: 'Test bookmark 21',
      url: 'https://nyt.com',
      createdOn: '2015-01-021T12:00:00-00:00'
    },
    {
      id: 22,
      title: 'Test bookmark 22',
      url: 'https://duckduckgo.com',
      createdOn: '2015-01-022T12:00:00-00:00'
    },
    {
      id: 23,
      title: 'Test bookmark 23',
      url: 'https://google.com',
      createdOn: '2015-01-023T12:00:00-00:00'
    },
    {
      id: 24,
      title: 'Test bookmark 24',
      url: 'https://nyt.com',
      createdOn: '2015-01-024T12:00:00-00:00'
    },
    {
      id: 25,
      title: 'Test bookmark 25',
      url: 'https://duckduckgo.com',
      createdOn: '2015-01-025T12:00:00-00:00'
    }
  ]
  const markup = shallow(<Bookmarks bookmarks={bookmarks}
    dispatch={() => {}}
    networkState=''
    page={1}
    endOfBookmarks={false} />) // eslint-disable-line

  t.ok(markup.children().length, 'It renders the bookmark')

  t.equal(markup.render().find('li').length, 25, 'It renders a max of 25 Bookmark components')

  t.equal(markup.find('.pagination').length, 1, 'It renders the pagination links')
  t.equal(markup.find('.pagination__link.disabled').length, 1, 'It renders only disables one pagination link')

  markup.find('.pagination__link').last().simulate('click', {
    preventDefault: sinon.spy()
  })

  t.equal(Bookmarks.prototype.__reactAutoBindMap.getMoreBookmarks.callCount, 1, 'It calls getMoreBookmarks when pagination is clicked')

  Bookmarks.prototype.__reactAutoBindMap.getMoreBookmarks.restore()

  t.end()
})
