'use strict'

const path = require('path')
const root = process.cwd()

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize'
}

exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks'
}

exports.sessionRedis = {
  enable: true,
  package: 'egg-session-redis'
}

exports.redis = {
  enable: true,
  package: 'egg-redis'
}

exports.gitlab = {
  enable: true,
  path: path.join(root, 'lib/plugin/egg-gitlab')
}

exports.mailer = {
  enable: false,
  package: 'egg-mailer'
}
