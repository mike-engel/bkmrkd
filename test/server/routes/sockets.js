import test from 'tape'
import http from 'http'
import io from 'socket.io-client'
import express from 'express'
import appConfig from '../../../config/app'
import socketRoutes from '../../../routes/sockets'

test('socket routes', (t) => {
  const app = express()
  const server = http.createServer(app)

  appConfig(app)
  socketRoutes(server)

  server.listen(4000)

  t.plan(2)

  setTimeout(() => {
    const socket = io.connect('http://localhost:4000')

    socket.emit('get-bookmarks', {
      page: 1
    })

    socket.on('old-bookmarks', (data) => {
      socket.disconnect()

      server.close()

      t.equal(typeof data, 'object', 'It sends an object back')
      t.ok(data.bookmarks, 'It sends back the bookmarks')

      t.end()
    })
  }, 1000)
})
