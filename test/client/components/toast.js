import React from 'react'
import test from 'tape'
import { shallow } from 'enzyme'
import Toast from '../../../src/js/components/toast'

test('toast component', (t) => {
  const toast = {
    message: 'This is a sample toast',
    style: 'success'
  }
  const markup = shallow(<Toast data={toast} />)

  t.ok(markup.hasClass('toast'), 'It renders the toast')
  t.ok(markup.hasClass('toast--success'), 'It adds the style to the class name')
  t.equal(markup.children().length, 1, 'It renders one child')
  t.equal(markup.first().text(), 'This is a sample toast', 'It renders the message')
  t.end()
})
