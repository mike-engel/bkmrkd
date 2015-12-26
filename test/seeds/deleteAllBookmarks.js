import rethink from 'rethinkdb'
import config from '../../helpers/config'

const env = process.env.NODE_ENV || 'development'

export default function (cb) {
  rethink.connect({
    host: config[env].rethinkdbHost,
    port: config[env].rethinkdbPort,
    db: config[env].rethinkdbName
  }, (err, connection) => {
    if (err) {
      return cb(err)
    }

    rethink.db(config[env].rethinkdbName).delete().run(connection, (err) => {
      if (err) {
        return cb(err)
      }

      cb(null)
    })
  })
}
