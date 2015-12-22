import express from 'express'
import { bookmarks, connection } from '../config/rethinkdb'

export const searchRouter = express.Router()

// /search?term=funny%20dogs
searchRouter.route('/')
  .get((req, res) => {
    const searchTerm = req.query.term.toLowerCase()

    console.log(searchTerm)

    bookmarks.filter((bookmark) => {
      return bookmark('title').downcase().match(searchTerm)
        .or(bookmark('url').downcase().match(searchTerm))
    }).run(connection, (err, cursor) => {
      if (err) {
        console.error('Error searching for bookmarks: ', err)
        return res.status(500).json({
          message: 'There was an error searching through the bookmarks.'
        })
      }

      cursor.toArray((err, results) => {
        if (err) {
          console.error('Error searching for bookmarks: ', err)
          return res.status(500).json({
            message: 'There was an error searching through the bookmarks.'
          })
        }

        console.log(results)

        return res.status(200).send()
      })
    })
  })
