const app = require('server')
const request = require('supertest')

const apiRequest = request(app)

describe('error routes', () => {
  it('should return a 404 for an unknown route', (done) => {
    apiRequest
      .get('/api/lol-not-here')
      .expect(404)
      .end(done)
  })

  it('should return a 500 if there was an internal error', (done) => {
    apiRequest
      .post('/api/bookmarks')
      .send({})
      .expect('Content-Type', /json/)
      .expect(500)
      .expect((res) => {
        if (!res.body.message) throw new Error('An error message should have come back')
        if (!res.body.error) throw new Error('The original error should have come back')
      })
      .end(done)
  })
})
