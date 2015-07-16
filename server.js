import express from 'express'
import http from 'http'
import socketIO from 'socket.io'
import compression from 'compression'
import bodyParser from 'body-parser'
import hpp from 'hpp'
import helmet from 'helmet'
import rethink from 'rethinkdb'
import React from 'react'
import escape from 'lodash.escape'
import Navigation from './lib/js/navigation.jsx'
import Bookmarks from './lib/js/bookmarks.jsx'

const app = express()
const server = http.Server(app)
const io = socketIO(server)
const env = process.env.NODE_ENV || 'development'

let connection
let bkmrkd

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
  scriptSrc: ["'self'", "'sha256-tiU2DTeAHzG5ooZjsp0XkWq9Dv0mWumq_F4c2E5A4FQ='"],
  styleSrc: ["'unsafe-inline'"],
  imgSrc: ["'none'"],
  connectSrc: ["'self'", 'ws:'],
  fontSrc: ["'none'"],
  objectSrc: ["'none'"],
  mediaSrc: ["'none'"],
  frameSrc: ["'none'"]
}))
app.use(helmet.xssFilter())
app.use(helmet.frameguard('deny'))
app.use(helmet.ieNoOpen())
app.use(helmet.noSniff())

http.globalAgent.maxSockets = 1000

app.route(/^\/(colophon)?$/)
  .get((req, res) => {
    const nav = React.createElement(Navigation, {
      page: req.path === '/' ? '' : 'colophon'
    })

    bkmrkd.table('bookmarks').orderBy({
      index: rethink.desc('createdOn')
    }).limit(25).run(connection, (err, cursor) => {
      if (err) {
        return res.render('500', {
          message: 'There\'s been an error getting the initial list of bookmarks.'
        })
      }

      cursor.toArray((err, result) => {
        if (err) {
          console.log('Error getting the initial list of bookmarks: ', err)

          return res.render('500', {
            message: 'There\'s been an error getting the initial list of bookmarks.'
          })
        }

        const bookmarks = React.createElement(Bookmarks, {
          bookmarks: result,
          socket: {}
        })

        return res.render('index', {
          navigation: React.renderToString(nav),
          bookmarks: React.renderToString(bookmarks),
          page: req.path.substr(1)
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
    return res.status(500).render('500')
  }
})

io.on('connection', (socket) => {
  bkmrkd.table('bookmarks').orderBy({
    index: rethink.desc('createdOn')
  }).limit(25).run(connection, (err, cursor) => {
    if (err) {
      console.log('Error getting the initial list of bookmarks: ', err)

      return socket.emit('error', {
        message: 'There\'s been an error getting the initial list of bookmarks. Try refreshing the page.'
      })
    }

    cursor.toArray((err, result) => {
      if (err) {
        console.log('Error getting the initial list of bookmarks: ', err)

        return socket.emit('error', {
          message: 'There\'s been an error getting the initial list of bookmarks. Try refreshing the page.'
        })
      }

      socket.emit('bookmarks', {
        bookmarks: result
      })
    })
  })

  bkmrkd.table('bookmarks').changes().run(connection, (err, cursor) => {
    if (err) {
      console.log('Error subscribing for updates: ', err)

      return socket.emit('error', {
        message: 'There\'s been an error subscribing for updates. Try refreshing the page.'
      })
    }

    cursor.each((err, bookmark) => {
      if (err) {
        console.log('Error subscribing for updates: ', err)

        return socket.emit('error', {
          message: 'There\'s been an error subscribing for updates. Try refreshing the page.'
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
        console.log('Error subscribing for updates: ', err)

        return socket.emit('error', {
          message: 'There\'s been an error subscribing for updates. Try refreshing the page.'
        })
      }

      socket.emit('bookmark-destroyed', {
        id: data.id
      })
    })
  })

  socket.on('get-bookmarks', (data) => {
    bkmrkd.table('bookmarks').skip(25 * (data.page - 1)).limit(25).run(connection, (err, cursor) => {
      if (err) {
        console.log('Error getting another page of bookmarks: ', err)

        return socket.emit('error', {
          message: 'There\'s been an error getting more bookmarks. Try again.'
        })
      }

      cursor.toArray((err, result) => {
        if (err) {
          console.log('Error getting another page of bookmarks: ', err)

          return socket.emit('error', {
            message: 'There\'s been an error getting more bookmarks. Try again.'
          })
        }

        if (result.length) {
          socket.emit('old-bookmarks', {
            bookmarks: result
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

server.listen(3000)
console.info('Bkmrkd has been started on port 3000.')
