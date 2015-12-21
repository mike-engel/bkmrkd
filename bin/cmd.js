#!/usr/bin/env node
var subarg = require('subarg')
var args = subarg(process.argv.slice(2))
var pm2 = require('pm2')
var path = require('path')

var port = args.p || args.port || '3000'
var configPath = args.c || args.config || process.env.BKMRKD_CONFIG_PATH

if (args.daemon || args.d) {
  pm2.connect(function (err) {
    if (err) {
      console.error('Error connecting to pm2: ', err)
      process.exit(1)
    }

    pm2.start({
      script: 'server.js',
      cwd: path.resolve(__dirname, '..'),
      args: ['--port ' + port, '--config ' + configPath],
      env: {
        'NODE_ENV': 'production'
      }
    }, function (err, apps) {
      if (err) {
        console.error('Error daemonizing bkmrkd: ', err)
        process.exit(1)
      }

      pm2.disconnect(function () {
        process.exit(0)
      })
    })
  })
} else if (args.help || args.h) {
  console.log([
    'Usage:',
    'bkmrkd [options]',
    '',
    'Options:',
    '--daemon, -d   Daemonize the bkmrkd process with pm2',
    '--config, -c   The path to your config file for bkmrkd',
    '  --port, -p   The port that bkmrkd should bind to. Defaults to 3000. Precedence is given to the config file',
    '  --help, -h   Print this help info'
  ].join('\n'))

  process.exit(0)
} else {
  require('../tmp/server').server.listen(args.port || args.p || '3000')
}
