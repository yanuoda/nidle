'use strict'

const gitlab = require('node-gitlab')
const assert = require('assert')

module.exports = app => {
  const config = app.config.gitlab

  assert(config.api, 'gitlab api is required!')
  assert(config.privateToken, 'gitlab privateToken is required!')

  app.gitlabApi = gitlab.createPromise({
    api: config.api,
    privateToken: config.privateToken
  })
}
