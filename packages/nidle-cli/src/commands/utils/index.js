const copyDir = require('./copyDir')
const getCurrentVersion = require('./getCurrentVersion')
const getGithubTags = require('./getGithubTags')
const Logger = require('./log')
const rm = require('./rm')
const { validateIfDepsUpdate, validateIfDevDepsUpdate } = require('./validateIfDepsUpdate')
const { version } = require('./version')
const runCommand = require('./runCommand')

module.exports = {
  copyDir,
  getCurrentVersion,
  getGithubTags,
  Logger,
  rm,
  validateIfDepsUpdate,
  validateIfDevDepsUpdate,
  runCommand,
  version
}
