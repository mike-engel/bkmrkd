import rethink from 'rethinkdb'
import config from '../helpers/config'

const env = process.env.NODE_ENV
const properName = 'bkmrkd_' + env

if (!env) {
  console.error('NODE_ENV isn\'t set. Please set that environment variable before running this command again')
  process.exit(1)
}

rethink.connect({
  host: config[env].rethinkdbHost || 'localhost',
  port: config[env].rethinkdbPort || 28015
}, (err, connection) => {
  if (err) {
    console.error('Error connecting to rethinkdb. Is it running?')
    process.exit(1)
  }

  rethink.dbList().run(connection, (err, dbs) => {
    if (err) {
      console.error('Error grabbing the dbs from rethink: ', err)
      process.exit(1)
    }

    if (dbs.indexOf(properName) === -1) {
      if (dbs.indexOf('bkmrkd') !== -1) {
        rethink.db('bkmrkd').config().update({
          name: properName
        }).run(connection, (err) => {
          if (err) {
            console.error('Error trying to update the existing db name: ', err)
            process.exit(1)
          }

          console.log('db name successfully changed from bkmrkd to ', properName)

          connection.close()

          process.exit(0)
        })
      } else {
        console.log('Nothing to change.')

        connection.close()

        process.exit(0)
      }
    } else {
      console.log('Nothing to change.')

      connection.close()

      process.exit(0)
    }
  })
})
