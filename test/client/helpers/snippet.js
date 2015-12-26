import test from 'tape'
import config from '../../../helpers/config'
import snippet from '../../../src/js/helpers/snippet'

const env = process.env.NODE_ENV || 'development'
const url = config[env].snippetHost

test('snippet helper', (t) => {
  const snippetRegExp = new RegExp(url, 'i')

  t.equal(typeof snippet, 'string', 'It returns a string for the snippet')
  t.ok(snippetRegExp.test(snippet), 'It uses the URL from the env config for the snippet url')
  t.end()
})
