import socketIO from 'socket.io'
import { bkmrkd, connection } from '../config/rethinkdb'
import countBookmarks from '../helpers/countBookmarks'

export default function (server) {
  const io = socketIO(server)

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
}
