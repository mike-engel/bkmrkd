const express = require('express')

const errorRouter = express()

errorRouter.use((req, res) => {
  return res.status(404).send()
})

errorRouter.use((err, req, res) => {
  return res.status(500).json({
    message: err.message,
    error: err
  })
})

module.exports = errorRouter
