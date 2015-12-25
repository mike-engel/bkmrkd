import React from 'react'
import test from 'tape'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import { SearchForm } from '../../../src/js/components/searchForm'

test('SearchForm component', (t) => {
  const dispatch = sinon.spy()

  let history = {
    push: function () {}
  }
  let evt = {
    preventDefault: function () {},
    target: {
      querySelector: function () {
        return {
          value: 'test'
        }
      }
    }
  }

  sinon.spy(SearchForm.prototype, 'handleSubmit')
  sinon.spy(history, 'push')
  sinon.spy(evt, 'preventDefault')
  sinon.spy(evt.target, 'querySelector')

  const markup = shallow(<SearchForm dispatch={dispatch} history={history} />)

  t.ok(markup.children().length, 'It renders _something_')
  t.notOk(SearchForm.prototype.handleSubmit.called, 'It doesn\'t call handleSubmit when rendering')
  t.equal(markup.render().find('#search-term').attr('placeholder'), 'search', 'It uses a default placeholder if a search term is not provided')

  markup.simulate('submit', evt)

  t.ok(SearchForm.prototype.handleSubmit.called, 'It calls the handleSubmit function when the form is submitted')
  t.ok(evt.preventDefault.called, 'It prevents the default form behavior when the form is submitted')
  t.ok(evt.target.querySelector.called, 'It gets the value of the input field')
  t.ok(dispatch.called, 'It calls dispatch when the form is submitted')
  t.ok(history.push.called, 'It calls the history.push method when the form is submitted')
  t.end()
})
