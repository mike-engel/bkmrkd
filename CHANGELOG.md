# 3.1.1

#### Bug fixes
- Removes yarn from the dockerfile
- Update the readme to be up to date

# 3.1.0

Dependency updates

#### Minor changes
- All dependencies have been updated (server and client)
- Prettier is now used over standard

# 3.0.0

3.0 is a complete rewrite of bookmarkd!

- Rewrites the node server to be more functional (in both senses)
- Ditches websockets as they don't provide much value
- Rewrites the entire front end in Elm because it's awesome and I can
- Moves to postgres for data storage after RethinkDB shut down :(

# 2.6.0

- Dependency updates

# 2.5.0

- Dependency updates

# 2.4.7

- Dependency updates

# 2.4.6

- Update react-router
- Apply placeholder styles to all browsers that support it

# 2.4.5

- Update postcss-import

# 2.4.4

- Update PM2

# 2.4.3

- Update dependencies

# 2.4.2

- Adds missing uglify-js dependency

# 2.4.1

- Fix run-scripts to run the correct file
- Fix config helper to return JSON and not a string
- Add minified files for use in production

# 2.4.0

- Split the server file into separate modules
- Added a search route to search for bookmarks based off of title and url
- Added search functionality to the client facing react app
- Lots of tests!

# 2.3.0

- Published to npm
- Added support for command-line usage
- Added support for requiring the app into your own node script

# 2.2.0

- Moved all CSS over to postCSS compiled with gulp.
- Added HTTPS support

# 2.1.0

- Added redux
- Added unit tests of front end components

# 2.0.0

- Complete redesign
- Switched over from MongoDB to RethinkDB
- Switched over to React for front end assets
