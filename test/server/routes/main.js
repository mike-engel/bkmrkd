// import test from 'tape'
// import request from 'supertest'
// import express from 'express'
// import sinon from 'sinon'
// import { mainRouter } from '../../../routes/main'
//
// test('main router', (t) => {
//   const clock = sinon.useFakeTimers()
//   const app = express()
//
//   clock.tick(1000)
//
//   app.use('/', mainRouter)
//
//   request(app).get('/')
//     .expect(200)
//     .expect((res) => {
//       t.equal(typeof res.body, 'string', 'It sends a string back to the client')
//     })
//     .end((err, res) => {
//       clock.restore()
//
//       if (err) {
//         t.fail('It failed with the error: ', err)
//       }
//
//       t.end()
//     })
// })
