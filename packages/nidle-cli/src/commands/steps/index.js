const downloadNidle = require('./downloadNidle')
const customEnvConfig = require('./customEnvConfig')
const { installPackages, installSpaPackages, installWebPackages } = require('./installPackages')
const buildSpa = require('./buildSpa')
const dbMigration = require('./dbMigration')
const startServer = require('./startServer')
const stopServer = require('./stopServer')
const coverNidleFiles = require('./coverNidleFiles')
const diffAndInquireEnvConfig = require('./diffAndInquireEnvConfig')

module.exports = {
  downloadNidle,
  customEnvConfig,
  installPackages,
  installSpaPackages,
  installWebPackages,
  buildSpa,
  dbMigration,
  startServer,
  stopServer,
  coverNidleFiles,
  diffAndInquireEnvConfig
}
