import express from 'express'
import rethink from 'rethinkdb'
import escape from 'lodash.escape'
import { bkmrkd, connection } from '../config/rethinkdb'

export const apiRouter = express.Router()

// /api/create?title=Some%20interesting%20title&url=http://google.com
apiRouter.route('/create')
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
