const config = require('config')
const { create, destroy, find, search } = require('server/actions')
const { Router } = require('express')

const apiRouter = Router()
const startTime = new Date()

apiRouter.route('/status')
  .get((req, res) => {
    return res.status(200).json({
      env: config.env,
      runningSince: startTime.toISOString()
    })
  })

apiRouter.route('/bookmarks')
  .get((req, res, next) => {
    const page = req.params.page || 1
    const limit = 25
    const offset = 25 * (page - 1)

    find({ limit, offset })
      .then((bookmarks) => {
        res.status(200).json(bookmarks)
      })
      .catch(next)
  })
  .post((req, res, next) => {
    create(req.body)
      .then((newBookmark) => {
        res.status(200).json(newBookmark)
      })
      .catch(next)
  })

apiRouter.route('/bookmarks/:id')
  .delete((req, res, next) => {
    destroy({ id: req.params.id })
      .then(() => find({}))
      .then((bookmarks) => {
        res.status(200).json(bookmarks)
      })
      .catch(next)
  })

apiRouter.route('/search')
  .get((req, res, next) => {
    const searchTerm = req.query.query

    search(searchTerm)
      .then((results) => {
        res.status(200).json(results)
      })
      .catch(next)
  })

module.exports = apiRouter
