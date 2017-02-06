const { knex } = require('config/db')
const proxyquire = require('proxyquire').noPreserveCache()

const handlerFunc = (req, res, next) => {}
const errorHandlerStub = sinon.stub().returns(handlerFunc)
const requestHandlerStub = sinon.stub().returns(handlerFunc)
const stubs = {
  raven: {
    middleware: {
      express: {
        errorHandler: errorHandlerStub,
        requestHandler: requestHandlerStub
      }
    }
  }
}
const bookmark = {
  title: 'index test bookmark',
  url: 'https://duckduckgo.com'
}
const bookmarks = Array.apply(null, { length: 26 }).map(() => bookmark)

before((done) => {
  knex.batchInsert('bookmarks', bookmarks)
    .then(() => done())
    .catch((err) => {
      throw new Error('There was a problem seeding the test db: ', err)
    })
})

after((done) => {
  knex('bookmarks').truncate().then(() => done())
})

describe('server', () => {
  afterEach(() => {
    errorHandlerStub.reset()
    requestHandlerStub.reset()
  })

  it('should not use raven if no token exists', () => {
    proxyquire('./index', Object.assign({}, stubs, {
      config: {
        ravenUrl: ''
      }
    }))

    expect(errorHandlerStub.callCount).to.equal(0)
    expect(requestHandlerStub.callCount).to.equal(0)
  })

  it('should use raven if a token exists', () => {
    proxyquire('./index', Object.assign({}, stubs, {
      config: {
        ravenUrl: '1234567890'
      }
    }))

    expect(errorHandlerStub.callCount).to.equal(1)
    expect(requestHandlerStub.callCount).to.equal(1)
    expect(errorHandlerStub).to.have.been.calledWith('1234567890')
    expect(requestHandlerStub).to.have.been.calledWith('1234567890')
  })
})
