import React from 'react'
import test from 'tape'
import { shallow } from 'enzyme'
import { Bkmrkd } from '../../src/js/containers/bkmrkd'

test('bkmrkd container', (t) => {
  const markup = shallow(<Bkmrkd dispatch={() => {}}
    history={{
      push: () => {}
    }}/>)

  t.ok(markup.hasClass('app') && markup.hasClass('container'), 'It renders the container')
  t.equal(markup.find('Link').length + markup.find('IndexLink').length, 3, 'It renders three links')
  t.end()
})
