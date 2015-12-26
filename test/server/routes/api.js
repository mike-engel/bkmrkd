import test from 'tape'
import request from 'supertest'
import express from 'express'
import appConfig from '../../../config/app'
import { apiRouter } from '../../../routes/api'
import countBookmarks from '../../../helpers/countBookmarks'

test('api router', (t) => {
  const app = express()

  appConfig(app)
  app.use('/api', apiRouter)

  t.plan(1)

  setTimeout(() => {
    countBookmarks((count) => {
      request(app).get('/api/create?title=test&url=https://duckduckgo.com')
        .expect(200)
        .end((err, res) => {
          if (err) {
            t.fail('It failed with the error: ', err)
          }

          countBookmarks((newCount) => {
            t.equal(newCount, count + 1, 'A new bookmark was successfully added')
            t.end()
          })
        })
    })
  }, 1000)
})
