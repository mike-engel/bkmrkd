import socketIO from 'socket.io'
import { bkmrkd, connection } from '../config/rethinkdb'
import countBookmarks from '../helpers/countBookmarks'
import getBookmarks from '../helpers/getBookmarks'
import searchBookmarks from '../helpers/searchBookmarks'

export default function (server) {
  const io = socketIO(server)

  let changesCursor
  let cursorNeedsToClose = false
  let cursorNeedsToFinish = false

  io.on('connection', (socket) => {
    bkmrkd.table('bookmarks').changes().run(connection, (err, cursor) => {
      if (err) {
        console.error('Error subscribing for updates: ', err)

        return socket.emit('error', {
          message: 'There\'s been an error subscribing for updates. Try refreshing the page.'
        })
      }

      changesCursor = cursor

      cursor.each((err, bookmark) => {
        if (err) {
          console.error('Error getting the bookmarks: ', err)

          return socket.emit('error', {
            message: 'There\'s been an error getting the bookmarks. Try again.'
          })
        }

        cursorNeedsToFinish = true

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

        cursorNeedsToFinish = false

        if (cursorNeedsToClose) {
          cursor.close()
        }
      })

      cursor.on('error', (err) => {
        console.error(err)
        process.exit(1)
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
        getBookmarks(data.page, 25, (err, results) => {
          if (err) {
            return socket.emit('error', {
              message: err.message
            })
          }

          return socket.emit('old-bookmarks', {
            bookmarks: results,
            endOfBookmarks: (25 * (data.page)) > bookmarkCount
          })
        })
      })
    })

    socket.on('search', (data) => {
      searchBookmarks(data.term, (err, results) => {
        if (err) {
          return socket.emit('error', {
            message: err.message
          })
        }

        return socket.emit('search-results', {
          bookmarks: results
        })
      })
    })

    socket.on('disconnect', () => {
      cursorNeedsToClose = true

      if (!cursorNeedsToFinish) {
        changesCursor.close()
      }
    })
  })
}
