import fs from 'fs'
import path from 'path'
import subarg from 'subarg'
import defaultConfig from '../config/environments'

export const args = subarg(process.argv.slice(2))

function readConfig () {
  return JSON.parse(fs.readFileSync(path.resolve(process.cwd(), args.c || args.config || process.env.BKMRKD_CONFIG_PATH), {
    encoding: 'utf8'
  }))
}

export default (args.c || args.config || process.env.BKMRKD_CONFIG_PATH ? readConfig() : defaultConfig)
