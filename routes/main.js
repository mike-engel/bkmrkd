import express from 'express'
import getBookmarks from '../helpers/getBookmarks'
import createStore from '../helpers/createStore'
import renderApp from '../helpers/renderApp'
import countBookmarks from '../helpers/countBookmarks'

export const mainRouter = express.Router()

mainRouter.route(/^\/(colophon)?$/)
  .get((req, res) => {
    const pageNumber = +req.query.page || 1

    countBookmarks((bookmarkCount) => {
      getBookmarks(pageNumber, 25, (err, results) => {
        if (err) {
          return res.status(500).json({
            message: err.message
          })
        }

        const store = createStore({
          bookmarks: results,
          endOfBookmarks: (25 * (pageNumber)) > bookmarkCount,
          networkState: '',
          page: pageNumber,
          searchTerm: '',
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
              initialState: store.getState()
            })
          } else {
            console.error('TODO: Page not found, handle this.')
          }
        })
      })
    })
  })
