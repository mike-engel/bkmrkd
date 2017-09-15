# bkmrkd

[![Greenkeeper badge](https://badges.greenkeeper.io/mike-engel/bkmrkd.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/mike-engel/bkmrkd.svg?branch=master)](https://travis-ci.org/mike-engel/bkmrkd)
![Dependencies](https://david-dm.org/mike-engel/bkmrkd.svg)

bkmrkd is a self-hosted, lightweight bookmarking service running on [node.js](https://nodejs.org), and [elm](https://elm-lang.org).

- [installation](#installation)
- [running in a production environment](#running-in-a-production-environment)
- [developing](#developing)
- [migrating](#migrating)
- [contributing](#contributing)
- [screenshots](#screenshot)
- [roadmap](#roadmap)
- [license](LICENSE.md)

# installation

## assumptons

1. You have node.js >= 6 installed
2. You have npm >= 5 installed
3. You either have postgres running, or have docker-compose installed

## running bkmrkd

As of version 3, all configuration is done through environment variables. For the list of environment variables, see [.env.sample](.env.sample).

### via docker (recommended)

```sh
# using an env file
docker run --env-file .env beardfury/bkmrkd

# specifying env vars separately
docker run \
  -e DB_HOST=localhost \
  -e DB_NAME=bkmrkd_development \
  ...etc
```

## saving

Simply drag the bookmarklet to your bookmarks bar and click it on a webpage you want to save.

# running in a production environment
So you want to run this for real. On the web. That's awesome. Everyone will want this to be setup differently, but this is how I've approached it.

1. Create an hosted PostgreSQL DB solution (Amazon RDS, Azure, Google, etc)
2. Deploy to [now](https://now.sh)

# developing

To work on bkmrkd locally, you'll want to start the node server for back end dev, the elm watcher for front end dev, or both.

```shell
# create the env file
cp .env.sample .env

# if you have docker and docker-compose installed
docker-compose up -d

# create the test database
createdb -h localhost -p 5432 -U postgres bkmrkd_test

# start the server in development mode
npm start | ./node_modules/.bin/bunyan

# start the elm watcher
npm run watch:elm
```

# migrating

The migration from 2.0 to 3.0 is pretty simple thanks to the awesome export capabilities of RethinkDB.

First, you'll want to download your existing bookmarks. From the computer with RethinkDB installed, dump the production database.

```sh
rethinkdb dump -f db-dump.tar.gz -e bkmrkd_production
```

Once it's dumped and downloaded to your computer (or do this remotely if you want), untar the tarball and look for the JSON file with all your bookmarks. Once you have that, run the migration script and assuming your `.env` file is currently pointed towards production, it should all work smoothly.

```sh
./scripts/migrate/rethink-to-postgresql ./path/to/json/file.json
```

# contributing

Please make a pull request! bkmrkd uses [prettier](https://github.com/prettier/prettier) for all JS development. For elm development, [elm-format](https://github.com/avh4/elm-format) should be used.

# screenshot
![Desktop screenshot](screenshots/desktop.png)

# roadmap

To keep track of the roadmap, I'm using [issues](https://github.com/mike-engel/bkmrkd/issues).

# [changelog](CHANGELOG.md)

# [code of conduct](CODE_OF_CONDUCT.md)

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

# [license](LICENSE.md)
