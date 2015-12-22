import express from 'express'
import rethink from 'rethinkdb'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { createStore, compose, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { ReduxRouter, routerStateReducer } from 'redux-router'
import { match, reduxReactRouter } from 'redux-router/server'
import { bkmrkd, connection } from '../config/rethinkdb'
import bkmrkdRoutes from '../src/js/main'
import { bookmarks, endOfBookmarks, networkState, page, toaster } from '../src/js/helpers/reducers'
import countBookmarks from '../helpers/countBookmarks'

export const mainRouter = express.Router()

mainRouter.route(/^\/(colophon)?$/)
  .get((req, res) => {
    const pageNumber = +req.query.page || 1

    countBookmarks((bookmarkCount) => {
      bkmrkd.table('bookmarks').orderBy({
        index: rethink.desc('createdOn')
      }).skip(25 * (pageNumber - 1)).limit(25).run(connection, (err, cursor) => {
        if (err) {
          return res.render('500', {
            message: 'There\'s been an error getting the initial list of bookmarks.'
          })
        }

        cursor.toArray((err, result) => {
          if (err) {
            console.error('Error getting the initial list of bookmarks: ', err)

            return res.render('500', {
              message: 'There\'s been an error getting the initial list of bookmarks.'
            })
          }

          const reducer = combineReducers({
            router: routerStateReducer,
            bookmarks,
            endOfBookmarks,
            networkState,
            toaster,
            page
          })
          const store = compose(
            reduxReactRouter({
              routes: bkmrkdRoutes
            })
          )(createStore)(reducer, {
            bookmarks: result,
            networkState: '',
            toaster: [],
            page: pageNumber,
            endOfBookmarks: (25 * (pageNumber)) > bookmarkCount
          })

          store.dispatch(match(req.url, (err, redirectLocation, renderProps) => {
            if (err) {
              console.error('Error matching the routes: ', err)
            }

            if (renderProps) {
              return res.render('index', {
                app: renderToString(<Provider store={store}><ReduxRouter {...renderProps} /></Provider>),
                initialState: store.getState()
              })
            } else {
              console.error('TODO: Page not found, handle this.')
            }
          }))
        })
      })
    })
  })
