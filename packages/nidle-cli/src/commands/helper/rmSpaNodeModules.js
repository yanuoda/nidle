const path = require('path')
const { rm } = require('../utils')

module.exports = async function rmSpaNodeModules(outPath) {
  await rm(path.resolve(outPath, './nidle-spa/node_modules'))
}
