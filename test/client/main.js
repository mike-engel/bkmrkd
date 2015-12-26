import test from 'tape'
import { Route } from 'react-router'
import { isElementOfType } from 'react-addons-test-utils'
import routes from '../../src/js/main'

test('main application', (t) => {
  t.ok(isElementOfType(routes, Route), 'It returns a route object')
  t.end()
})
