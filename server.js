import express from 'express'
import http from 'http'
import socketIO from 'socket.io'
import path from 'path'
import rethink from 'rethinkdb'

const app = express()
const server = http.Server(app)
const io = socketIO(server)

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
app.use(express.static('./dist'))

http.globalAgent.maxSockets = 1000

app.route('/')
  .get((req, res) => {
    res.render('index', {
      markup: '<h2 className="h1">No bookmarks yet! Place the script in your bookmarks bar and start bookmarking!</h2>'
    })
  })

app.route('/colophon')
  .get((req, res) => {
    res.sendFile(path.join(__dirname, './views/colophon.html'))
  })

// /api/create?title=Some%20interesting%20title&url=http://google.com
app.route('/api/create')
  .get((req, res) => {
    if (!req.query.title && !req.query.url) {
      console.error('Need a title and url!')
      return res.status(500).json({
        message: 'Need a title and url for your bookmark!'
      })
    }

    bkmrkd.table('bookmarks').insert({
      title: req.query.title,
      url: req.query.url,
      createdOn: new Date()
    }).run(connection, (err, response) => {
      if (err) {
        return res.status(500).json({
          message: 'Trouble saving your bookmark. Try again?'
        })
      }

      return res.status(200).send()
    })
  })

io.on('connection', (socket) => {
  bkmrkd.table('bookmarks').limit(25).run(connection, (err, cursor) => {
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
})

server.listen(3000)
console.info('Bkmrkd has been started on port 3000.')
