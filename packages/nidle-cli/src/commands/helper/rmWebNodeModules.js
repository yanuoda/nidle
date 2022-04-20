const path = require('path')
const { rm } = require('../utils')

module.exports = async function rmWebNodeModules(outPath) {
  await rm(path.resolve(outPath, './nidle-web/node_modules'))
}
