import test from 'tape'
import config from '../../../helpers/config'

test('config helper', (t) => {
  t.equal(typeof config, 'object', 'It exports an object')
  t.equal(Object.keys(config).length, 3, 'It exports an object with three root keys')
  t.equal(Object.keys(config).join(' '), 'development stage production', 'It exports the default config')
  t.end()
})
