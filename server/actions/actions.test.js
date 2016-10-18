const { create, destroy, find } = require('./index')

describe('server actions', () => {
  describe('create action', () => {
    it('should insert a new bookmark', (done) => {
      const bookmark = { title: 'test bookmark', url: 'https://duckduckgo.com' }

      create(bookmark)
        .then((newBookmark) => {
          expect(newBookmark).to.be.an('object')
          expect(newBookmark.id).to.be.a('number')
          expect(newBookmark.title).to.equal(bookmark.title)
          expect(newBookmark.url).to.equal(bookmark.url)
          expect(newBookmark.createdAt).to.be.a('date')

          done()
        })
        .catch(done)
    })
  })

  describe('destroy action', () => {
    it('should delete bookmark', (done) => {
      const bookmark = { title: 'test bookmark', url: 'https://duckduckgo.com' }

      create(bookmark)
        .then((newBookmark) => {
          destroy({ id: newBookmark.id })
            .then(() => {
              done()
            })
            .catch(done)
        })
        .catch(done)
    })
  })

  describe('find action', () => {
    it('should find a specific bookmark', (done) => {
      const bookmark = { title: 'test bookmark', url: 'https://duckduckgo.com' }

      create(bookmark)
        .then((newBookmark) => {
          find({ id: newBookmark.id })
            .then((bookmarks) => {
              expect(bookmarks).to.have.length(1)
              expect(bookmarks[0].title).to.equal(bookmark.title)
              expect(bookmarks[0].url).to.equal(bookmark.url)

              done()
            })
            .catch(done)
        })
        .catch(done)
    })

    it('should find all bookmarks', (done) => {
      find({})
        .then((bookmarks) => {
          expect(bookmarks).to.have.length.greaterThan(1)

          done()
        })
        .catch(done)
    })
  })
})
