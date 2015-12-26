import test from 'tape'
import request from 'supertest'
import express from 'express'
import appConfig from '../../../config/app'
import { searchRouter } from '../../../routes/search'

test('search router', (t) => {
  const app = express()

  appConfig(app)
  app.use('/search', searchRouter)

  t.plan(2)

  setTimeout(() => {
    request(app).get('/search?term=2')
      .expect(200)
      .expect((res) => {
        t.ok(/<!doctype html>/i.test(res.text), 'It sends an HTML document back')
        t.ok(/Just so you know/i.test(res.text), 'It sends the index view to the client')
      })
      .end((err, res) => {
        if (err) {
          t.fail('It failed with the error: ', err)
        }

        t.end()
      })
  }, 1000)
})
