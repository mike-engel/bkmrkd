import test from 'tape'
import { connection } from '../config/rethinkdb'

import './server/helpers/config'
import './server/helpers/createStore'
import './server/helpers/renderApp'
import './server/helpers/countBookmarks'
import './server/helpers/getBookmarks'
import './server/helpers/searchBookmarks'
import './server/config/rethinkdb'
import './server/routes/errors'
import './server/routes/main'
import './server/routes/search'
import './server/routes/api'
// Because bkmrkd uses rethinkdb changefeeds
// it causes race conditions in the tests.
// So, we'll disable it for now.
// import './server/routes/sockets'

import './client/main'
import './client/helpers/actions'
import './client/helpers/reducers'
import './client/helpers/history'
import './client/helpers/snippet'
import './client/containers/bkmrkd'
import './client/containers/toaster'
import './client/components/toast'
import './client/components/colophon'
import './client/components/bookmark'
import './client/components/bookmarks'
import './client/components/searchForm'
import './client/components/search'

test.onFinish(() => {
  // give time for the socket to close out
  setTimeout(() => {
    connection.close()
  }, 1000)
})
