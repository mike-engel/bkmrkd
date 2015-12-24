import express from 'express'
import searchBookmarks from '../helpers/searchBookmarks'

export const searchRouter = express.Router()

// /search?term=funny%20dogs
searchRouter.route('/')
  .get((req, res) => {
    const searchTerm = (req.query.term || '').toLowerCase()

    searchBookmarks(searchTerm, (err, results) => {
      if (err) {
        return res.status(500).json({
          message: err.message
        })
      }

      return res.status(200).send()
    })
  })
