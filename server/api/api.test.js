const { app } = require('server')
const { create } = require('server/actions')
const { env } = require('config')
const request = require('supertest')

const apiRequest = request(app)

describe('api routes', () => {
  describe('status endpoint', () => {
    it('should return the server status', (done) => {
      apiRequest
        .get('/api/status')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          if (res.body.env !== env) throw new Error('The correct environment wasn\'t returned')
          if (new Date(res.body.runningSince).toString() === 'Invalid Date') throw new Error('An invalid date was returned')
        })
        .end(done)
    })
  })

  describe('bookmarks routes', () => {
    it('should return a list of bookmarks', (done) => {
      const bookmark = {
        title: 'index test bookmark',
        url: 'https://duckduckgo.com'
      }

      create(bookmark)
        .then(() => {
          apiRequest
            .get('/api/bookmarks')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => {
              if (!Array.isArray(res.body)) throw new Error('An array was not returned')
              if (!res.body.length) throw new Error('It should have returned a non-empty array')
            })
            .end(done)
        })
        .catch(done)
    })

    it('should create a new bookmark', (done) => {
      const bookmark = {
        title: 'post test bookmark',
        url: 'https://duckduckgo.com'
      }

      apiRequest
        .post('/api/bookmarks')
        .send(bookmark)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          if (!Object.keys(res.body).length) throw new Error('The new activity was not returned')
          if (res.body.title !== bookmark.title) throw new Error('The wrong title was used')
          if (res.body.url !== bookmark.url) throw new Error('The wrong URL was used')
        })
        .end(done)
    })
  })

  describe('bookmark routes', () => {
    it('should return a specific bookmark', (done) => {
      const bookmark = {
        title: 'get test bookmark',
        url: 'https://duckduckgo.com'
      }

      create(bookmark)
        .then((newBookmark) => {
          apiRequest
            .get(`/api/bookmarks/${newBookmark.id}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => {
              if (
                newBookmark.title !== res.body.title ||
                newBookmark.url !== res.body.url
              ) {
                throw new Error('The specified activity was not returned in full')
              }
            })
            .end(done)
        })
        .catch(done)
    })

    it('should delete a bookmark', (done) => {
      const bookmark = {
        title: 'delete test bookmark',
        url: 'https://duckduckgo.com'
      }

      create(bookmark)
        .then((newBookmark) => {
          apiRequest
            .delete(`/api/bookmarks/${newBookmark.id}`)
            .expect(204)
            .expect((res) => {
              if (Object.keys(res.body).length) throw new Error('There should be nothing returned')
            })
            .end(done)
        })
        .catch(done)
    })
  })
})
