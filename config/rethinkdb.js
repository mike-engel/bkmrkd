import rethink from 'rethinkdb'
import config, { args } from '../helpers/config'

const env = process.env.NODE_ENV || 'development'
const rethinkdbHost = config[env].rethinkdbHost || args.rethinkdbHost || 'localhost'
const rethinkdbPort = config[env].rethinkdbPort || args.rethinkdbPort || 28015
const rethinkdbName = config[env].rethinkdbName || args.rethinkdbName || 'bkmrkd_development'

export let connection
export let bkmrkd
export let bookmarks

function createDatabase () {
  rethink.dbList().run(connection, (err, dbs) => {
    if (err) {
      throw new Error('Error getting the list of databases: ', err)
    }

    if (dbs.indexOf(rethinkdbName) === -1) {
      rethink.dbCreate(rethinkdbName).run(connection, (err, response) => {
        if (err) {
          throw new Error('Error creating the bkmrkd database: ', err)
        }

        console.info('Created the bkmrkd database')
      })
    }

    bkmrkd = rethink.db(rethinkdbName)

    createTable()
  })
}

function createTable () {
  bkmrkd.tableList().run(connection, (err, tables) => {
    if (err) {
      throw new Error('Error getting the list of databases: ', err)
    }

    if (tables.indexOf('bookmarks') === -1) {
      bkmrkd.tableCreate('bookmarks').run(connection, (err, response) => {
        if (err) {
          throw new Error('There was a problem creating the bookmarks table: ', err)
        }

        console.info('creating the bookmarks table')

        createIndex()
      })
    }

    bookmarks = bkmrkd.table('bookmarks')
  })
}

function createIndex () {
  bkmrkd.table('bookmarks').indexCreate('createdOn').run(connection, (err, response) => {
    if (err) {
      throw new Error('Error creating the bookmarked index: ', err)
    }

    console.info('creating the bookmarks index')
  })
}

rethink.connect({
  host: rethinkdbHost,
  port: rethinkdbPort
}, (err, conn) => {
  if (err) {
    throw new Error('Error connecting to rethinkdb: ', err)
  }

  connection = conn

  createDatabase()
})
