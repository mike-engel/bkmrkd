import React from 'react'
import { match } from 'redux-router/server'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { ReduxRouter } from 'redux-router'

export default function (store, url, cb) {
  store.dispatch(match(url, (err, redirectLocation, renderProps) => {
    if (err) {
      console.error('Error matching the routes: ', err)

      return cb({
        message: 'Error matching the routes'
      })
    }

    if (renderProps) {
      return cb(null, renderToString(<Provider store={store}><ReduxRouter {...renderProps} /></Provider>))
    } else {
      console.error('TODO: Page not found, handle this.')
    }
  }))
}
