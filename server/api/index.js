const config = require('config')
const { create, find, destroy } = require('server/actions')
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
    find({})
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
  .get((req, res, next) => {
    find({ id: req.params.id })
      .then((bookmarks) => {
        res.status(200).json(bookmarks[0])
      })
      .catch(next)
  })
  .delete((req, res, next) => {
    destroy({ id: req.params.id })
      .then(() => {
        res.status(204).send()
      })
      .catch(next)
  })

module.exports = apiRouter
