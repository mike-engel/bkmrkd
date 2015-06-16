var express = require('express')
var http = require('http')
var app = express()
var server = http.createServer(app)
var io = require('socket.io').listen(server)
var path = require('path')

app.set('view-engine', 'ejs')

http.globalAgent.maxSockets = 1000

app.route('/')
  .get(function (req, res) {
    res.sendFile(path.join(__dirname, './views/index.html'))
  })

app.route('colophon')
  .get(function (req, res) {
    res.sendFile(path.join(__dirname, './views/colophon.html'))
  })

io.on('connection', function (socket) {
  /**
   * Do socket things
   */
})

server.listen(3000)
console.info('Bkmrkd has been started on port 3000.')
