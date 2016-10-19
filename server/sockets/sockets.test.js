const {
  configSocketRouter,
  createSocketMessage,
  emitSocketMessage
} = require('./index')
const { eventBus } = require('server/utils')

const wsStub = {
  send: sinon.stub()
}

configSocketRouter(wsStub)

describe('websocket handlers', () => {
  afterEach(() => {
    wsStub.send.reset()
  })

  it('should create websocket message payloads', () => {
    const event = 'test.event'
    const data = { test: [1, 2, 3] }
    const message = createSocketMessage(event, data)

    expect(message).to.be.a('string')
    expect(JSON.parse(message).data).to.deep.equal(data)
  })

  it('should send a message over the socket connection', () => {
    const message = createSocketMessage('test.event', { test: [1, 2, 3] })

    emitSocketMessage(wsStub, message)

    expect(wsStub.send.callCount).to.equal(1)
    expect(wsStub.send).to.have.been.calledWith(message)
  })

  it('should send messages over the socket connection for internal events', () => {
    const bookmark = { title: 'hey', url: 'https://duckduckgo.com' }

    eventBus.emit('bookmark.created', bookmark)
    eventBus.emit('bookmark.deleted', bookmark)

    const firstMessage = JSON.parse(wsStub.send.getCall(0).args[0])
    const secondMessage = JSON.parse(wsStub.send.getCall(1).args[0])

    expect(firstMessage.event).to.equal('bookmark.created')
    expect(firstMessage.data).to.deep.equal(bookmark)
    expect(secondMessage.event).to.equal('bookmark.deleted')
    expect(secondMessage.data).to.deep.equal(bookmark)
  })
})
