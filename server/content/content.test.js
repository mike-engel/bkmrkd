const { app } = require('server')
const request = require('supertest')

const apiRequest = request(app)

describe('content routes', () => {
  describe('index', () => {
    it('should return an HTML page', (done) => {
      apiRequest
        .get('/')
        .expect(200)
        .expect('Content-Type', /html/)
        .expect((res) => {
          if (!/^<!doctype html>/.test(res.text)) throw new Error('an HTML page was not returned')
        })
        .end(done)
    })
  })

  describe('colophon', () => {
    it('should return an HTML page', (done) => {
      apiRequest
        .get('/')
        .expect(200)
        .expect('Content-Type', /html/)
        .expect((res) => {
          if (!/^<!doctype html>/.test(res.text)) throw new Error('an HTML page was not returned')
        })
        .end(done)
    })
  })

  describe('404', () => {
    it('should return an HTML page', (done) => {
      apiRequest
        .get('/some-page')
        .expect(404)
        .expect((res) => {
          if (/^<!doctype html>/.test(res.text)) throw new Error('an HTML page was returned')
        })
        .end(done)
    })
  })
})
