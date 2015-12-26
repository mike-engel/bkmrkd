import React from 'react'
import test from 'tape'
import { shallow, render } from 'enzyme'
import Toaster from '../../../src/js/containers/toaster'

test('toaster container', (t) => {
  const markup = shallow(<Toaster toasts={[]} />)

  t.ok(markup.hasClass('toaster'), 'It renders the container')
  t.equal(markup.children().length, 0, 'It renders no children when no toasts are passed in')
  t.end()
})

test('toaster container', (t) => {
  const toast = {
    message: 'Example toast',
    style: 'success'
  }
  const markup = render(<Toaster toasts={[toast]} />)

  t.equal(markup.find('.toast').length, 1, 'It renders any toasts provided')
  t.end()
})
