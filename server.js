import fs from 'fs'
import path from 'path'
import express from 'express'
import spdy from 'spdy'
import socketIO from 'socket.io'
import compression from 'compression'
import bodyParser from 'body-parser'
import hpp from 'hpp'
import helmet from 'helmet'
import rethink from 'rethinkdb'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { createStore, compose, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { ReduxRouter, routerStateReducer } from 'redux-router'
import { match, reduxReactRouter } from 'redux-router/server'
import escape from 'lodash.escape'
import subarg from 'subarg'
import defaultConfig from './config/environments'
import bkmrkdRoutes from './src/js/main'
import { bookmarks, endOfBookmarks, networkState, page, toaster } from './src/js/helpers/reducers'

const env = process.env.NODE_ENV || 'development'
const args = subarg(process.argv.slice(2))
const config = args.c || args.config || process.env.BKMRKD_CONFIG_PATH ? readConfig() : defaultConfig
const port = config[env].port || args.p || args.port || 3000
const spdyOptions = {
  key: fs.readFileSync(config[env].certKey),
  cert: fs.readFileSync(config[env].cert)
}

export const app = express()
export const server = spdy.createServer(spdyOptions, app)
const io = socketIO(server)

let connection
let bkmrkd

function readConfig () {
  return fs.readFileSync(path.resolve(process.cwd(), args.c || args.config || process.env.BKMRKD_CONFIG_PATH), {
    encoding: 'utf8'
  })
}

function createDatabase () {
  rethink.dbList().run(connection, (err, dbs) => {
    if (err) {
      throw new Error('Error getting the list of databases: ', err)
    }

    if (dbs.indexOf('bkmrkd') === -1) {
      rethink.dbCreate('bkmrkd').run(connection, (err, response) => {
        if (err) {
          throw new Error('Error creating the bkmrkd database: ', err)
        }

        console.info('Created the bkmrkd database')
      })
    }

    bkmrkd = rethink.db('bkmrkd')

    createTable()
  })
}

function createTable () {
  bkmrkd.tableList().run(connection, (err, tables) => {
    if (err) {
      throw new Error('Error getting the list of databases: ', err)
    }

    if (tables.indexOf('bookmarks') === -1) {
      bkmrkd.tableCreate('bookmarks').run(connection, (err, response) => {
        if (err) {
          throw new Error('There was a problem creating the bookmarks table: ', err)
        }

        console.info('creating the bookmarks table')
        createIndex()
      })
    }
  })
}

function createIndex () {
  bkmrkd.table('bookmarks').indexCreate('createdOn').run(connection, (err, response) => {
    if (err) {
      throw new Error('Error creating the bookmarked index: ', err)
    }

    console.info('creating the bookmarks index')
  })
}

function countBookmarks (cb) {
  bkmrkd.table('bookmarks').count().run(connection, (err, count) => {
    if (err) {
      console.error('Error counting the bookmarks!')
    }

    cb(count)
  })
}

rethink.connect({
  host: 'localhost',
  post: 28015
}, (err, conn) => {
  if (err) {
    throw new Error('Error connecting to rethinkdb: ', err)
  }

  connection = conn

  createDatabase()
})

app.set('view engine', 'ejs')
app.set('x-powered-by', false)
app.set('trust proxy', true)
app.set('query parser', 'simple')

app.use(compression())
app.use(express.static('./dist', {
  maxAge: env === 'development' ? 0 : 31500000000,
  index: false
}))
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(hpp())
app.use(helmet.contentSecurityPolicy({
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'"],
  styleSrc: ["'self'"],
  imgSrc: ["'none'"],
  connectSrc: ["'self'", 'ws:'],
  fontSrc: ["'none'"],
  objectSrc: ["'none'"],
  mediaSrc: ["'none'"],
  frameSrc: ["'none'"]
}))
app.use(helmet.xssFilter())
app.use(helmet.frameguard('deny'))
app.use(helmet.hsts({
  maxAge: 31500000000,
  includeSubdomains: true
}))
app.use(helmet.ieNoOpen())
app.use(helmet.noSniff())
app.use(helmet.hpkp({
  maxAge: 7776000000,
  sha256s: config[env].publicKeyPins
}))

app.route(/^\/(colophon)?$/)
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

// /api/create?title=Some%20interesting%20title&url=http://google.com
app.route('/api/create')
  .get((req, res) => {
    if (!req.query.title && !req.query.url) {
      console.error('Need a title and url!')

      return res.render('500', {
        message: 'Need a title and URL for your bookmark!'
      })
    }

    bkmrkd.table('bookmarks').insert({
      title: escape(req.query.title),
      url: escape(req.query.url),
      createdOn: rethink.now()
    }).run(connection, (err, response) => {
      if (err) {
        return res.render('500', {
          message: 'bkmrkd had trouble saving your bookmark. Try again?'
        })
      }

      return res.status(200).send()
    })
  })

app.use((req, res) => {
  return res.status(404).render('404')
})

app.use((err, req, res, next) => {
  if (err) {
    console.error(err)

    return res.status(500).render('500')
  }
})

io.on('connection', (socket) => {
  bkmrkd.table('bookmarks').changes().run(connection, (err, cursor) => {
    if (err) {
      console.error('Error subscribing for updates: ', err)

      return socket.emit('error', {
        message: 'There\'s been an error subscribing for updates. Try refreshing the page.'
      })
    }

    cursor.each((err, bookmark) => {
      if (err) {
        console.error('Error getting the bookmarks: ', err)

        return socket.emit('error', {
          message: 'There\'s been an error getting the bookmarks. Try again.'
        })
      }

      if (bookmark['old_val']) {
        socket.emit('bookmark-update', {
          old: bookmark['old_val'],
          new: bookmark['new_val']
        })
      } else {
        socket.emit('new-bookmark', {
          bookmark: bookmark['new_val']
        })
      }
    })
  })

  socket.on('destroy-bookmark', (data) => {
    bkmrkd.table('bookmarks').get(data.id).delete().run(connection, (err, response) => {
      if (err) {
        console.error('Error deleting the bookmark: ', err)

        return socket.emit('error', {
          message: 'There\'s been an error deleting the bookmark. Try again.'
        })
      }

      socket.emit('bookmark-destroyed', {
        id: data.id
      })
    })
  })

  socket.on('get-bookmarks', (data) => {
    countBookmarks((bookmarkCount) => {
      bkmrkd.table('bookmarks').skip(25 * (data.page - 1)).limit(25).run(connection, (err, cursor) => {
        if (err) {
          console.error('Error getting another page of bookmarks: ', err)

          return socket.emit('error', {
            message: 'There\'s been an error getting more bookmarks. Try again.'
          })
        }

        cursor.toArray((err, result) => {
          if (err) {
            console.error('Error getting another page of bookmarks: ', err)

            return socket.emit('error', {
              message: 'There\'s been an error getting more bookmarks. Try again.'
            })
          }

          if (result.length) {
            socket.emit('old-bookmarks', {
              bookmarks: result,
              endOfBookmarks: (25 * (data.page)) > bookmarkCount
            })
          } else {
            socket.emit('old-bookmarks', {
              message: 'No more bookmarks!'
            })
          }
        })
      })
    })
  })
})

server.listen(port)
console.info('Bkmrkd has been started on port 3000.')
