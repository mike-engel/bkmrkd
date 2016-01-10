import test from 'tape'
import history from '../../../src/js/helpers/history'
import { createMemoryHistory } from 'history'

// until I figure out how to test this with a DOM, history will return nothing
test('history helper', (t) => {
  t.equal(history, createMemoryHistory, 'It returns createMemoryHistory without a DOM')
  t.end()
})
