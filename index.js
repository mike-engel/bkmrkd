const app = require('./server')
const config = require('./config')

app.listen(config.port)

console.info(`bkmrkd has been started on port ${config.port}.`)
console.info(JSON.stringify(config, null, 2))
