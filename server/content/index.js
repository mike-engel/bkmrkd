const { env } = require('config')
const { Router } = require('express')

const contentRouter = Router()

contentRouter.route(/^\/$|^\/colophon$/i)
  .get((req, res) => {
    return res.status(200).render('index', {
      env
    })
  })

module.exports = contentRouter
