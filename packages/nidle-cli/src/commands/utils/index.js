const copyDir = require('./copyDir')
const getCurrentVersion = require('./getCurrentVersion')
const getGithubTags = require('./getGithubTags')
const Logger = require('./log')
const rm = require('./rm')
const validateIfDepsUpdate = require('./validateIfDepsUpdate')
const { version } = require('./version')

module.exports = {
  copyDir,
  getCurrentVersion,
  getGithubTags,
  Logger,
  rm,
  validateIfDepsUpdate,
  version
}
