import React from 'react'
import test from 'tape'
import { shallow } from 'enzyme'
import Colophon from '../../src/js/components/colophon'

test('colophon component', (t) => {
  const markup = shallow(<Colophon />)

  t.ok(markup.hasClass('colophon'), 'It renders the colophon')
  t.end()
})
