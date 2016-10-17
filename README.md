# bkmrkd


[![Build Status](https://travis-ci.org/mike-engel/bkmrkd.svg?branch=redux-tests-43)](https://travis-ci.org/mike-engel/bkmrkd)
![Dependencies](https://david-dm.org/mike-engel/bkmrkd.svg)

bkmrkd is a self-hosted, lightweight bookmarking service running on [node.js](https://nodejs.org), [elm](https://elm-lang.org).

[screenshots](#screenshots)  
[installation](#installation)  
[running in a production environment](#running-in-a-production-environment)  
[contributing](#contributing)  
[roadmap]($roadmap)  
[license](LICENSE.md)

# screenshots
## desktop
![Home page](screenshots/desktop.png)

## mobile
![Mobile](screenshots/mobile.png)

## colophon
![Colophon](screenshots/colophon.png)

# installation

## assumptons

1. You have node.js >= 6 installed
2. You either have postgres running, or have docker-compose installed

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

Simply drag the bookmarklet to your bookmarks bar and click it on a webpage you want to save. Simple.

# running in a production environment
So you want to run this for real. On the web. That's awesome. Everyone will want this to be setup differently, but this is how I've approached it.

1. Proxy through nginx. Listen on port 80 for a domain/subdomain and proxy_pass to the app running on port 3000.
2. Use SSL certs to avoid a new window opening when bookmarking things.
3. Use a variety of [startup scripts](#running-bkmrkd) and [backup](http://rethinkdb.com/docs/backup/) scripts.

# developing

To work on bkmrkd locally, you'll want to start the node server and run gulp.

```shell
# create the env file
cp .env.sample .env

# if you have docker and docker-compose installed
docker-compose up -d

# start the server in development mode
npm start
```

# contributing

Please make a pull request! bkmrkd follows the [js standard](https://github.com/feross/standard) styleguide.

# roadmap

To keep track of the roadmap, I'm using [issues](https://github.com/mike-engel/bkmrkd/issues), and more specifically, [milestones](https://github.com/mike-engel/bkmrkd/milestones).

# [changelog](CHANGELOG.md)

# [license](LICENSE.md)
