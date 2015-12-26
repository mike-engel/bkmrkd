import test from 'tape'
import express from 'express'
import request from 'supertest'
import appConfig from '../../../config/app'
import errorRoutes from '../../../routes/errors'

test('error routes', (t) => {
  const app = express()

  appConfig(app)

  app.get('/error', (req, res, next) => {
    res.status(500)

    next('Server error')
  })

  errorRoutes(app)

  request(app)
    .get('/not-found-lol')
    .expect(404)
    .expect((res) => {
      t.ok(/<!doctype html>/i.test(res.text), 'It renders an HTML page')
      t.ok(/That page doesn't exist/i.test(res.text), 'It renders the 404 view')
    })
    .end((err, res) => {
      if (err) {
        t.fail('It failed because: ', err)
      }
    })

  request(app)
    .get('/error')
    .expect(500)
    .expect((res) => {
      t.ok(/<!doctype html>/i.test(res.text), 'It renders an HTML page')
      t.ok(/let the owner of this bkmrkd instance know\./i.test(res.text), 'It renders the 500 view')
    })
    .end((err, res) => {
      if (err) {
        t.fail('It failed because: ', err)
      }

      t.end()
    })
})
