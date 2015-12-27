import express from 'express'
import searchBookmarks from '../helpers/searchBookmarks'
import createStore from '../helpers/createStore'
import renderApp from '../helpers/renderApp'

export const searchRouter = express.Router()

// /search?term=funny%20dogs
searchRouter.route('/')
  .get((req, res) => {
    const searchTerm = (req.query.term || '').toLowerCase()

    searchBookmarks(searchTerm, (err, results) => {
      if (err) {
        return res.status(500).json({
          message: err.message
        })
      }

      const store = createStore({
        bookmarks: results,
        endOfBookmarks: true,
        networkState: '',
        page: 1,
        searchTerm: searchTerm,
        toaster: []
      })

      renderApp(store, req.url, (err, appMarkup) => {
        if (err) {
          return res.status(500).json({
            message: err.message
          })
        }

        if (appMarkup) {
          return res.render('index', {
            app: appMarkup,
            initialState: store.getState(),
            env: process.env.NODE_ENV || 'development'
          })
        } else {
          console.error('TODO: Page not found, handle this.')
        }
      })
    })
  })
