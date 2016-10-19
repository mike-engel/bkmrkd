const { curry, pipe } = require('ramda')
const { eventBus } = require('server/utils')
const WebSocketServer = require('ws').Server

// configSocketRouter :: Object -> Void
const configSocketRouter = (ws) => {
  eventBus.on(
    'bookmark.created',
    pipe(createSocketMessage('bookmark.created'), emitSocketMessage(ws))
  )

  eventBus.on(
    'bookmark.deleted',
    pipe(createSocketMessage('bookmark.deleted'), emitSocketMessage(ws))
  )
}

// createSocketMessage :: String -> Any -> String
const createSocketMessage = curry((event, data) => {
  return JSON.stringify({
    event,
    data
  })
})

// emitSocketMessage :: Websocket -> String -> Void
const emitSocketMessage = curry((ws, message) => {
  ws.send(message)
})

// main :: Object -> Void
const main = (server) => {
  const wss = WebSocketServer({ server })

  wss.on('connection', configSocketRouter)
}

module.exports = {
  configSocketRouter,
  createSocketMessage,
  emitSocketMessage,
  main
}
