import test from 'test'
import io from 'socket.io-client'
import express from 'express'
import socketRoutes from '../../../routes/sockets'

test('socket routes', (t) => {
  const app = express()
  const server = app.listen(4000)

  socketRoutes(server)

  const socket = io.connect('http://localhost:4000')

  socket.emit('get-bookmarks', {
    page: 1
  })

  socket.on('old-bookmarks', (data) => {
    t.equal(typeof data, 'object', 'It sends an object back')
    t.ok(data.bookmarks, 'It sends back the bookmarks')
  })
})
