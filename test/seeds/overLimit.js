import rethink from 'rethinkdb'
import config from '../../helpers/config'
import data from './data'

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

    rethink.db(config[env].rethinkdbName).delete().insert(data).run(connection, (err, results) => {
      if (err) {
        return cb(err)
      }

      cb(null, results)
    })
  })
}
