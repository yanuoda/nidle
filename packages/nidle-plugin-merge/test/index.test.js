const gitlab = require('../lib/gitlab')
const github = require('../lib/github')
const task = require('./fixtures/config')

gitlab(
  {
    ...task,
    repository: {
      type: 'git',
      url: 'http://gitbj.haihangyun.com/ava/style-y8.git',
      branch: 'daily/nidle',
      userName: 'chb.wang',
      id: 1166
    }
  },
  {
    apiUrl: 'http://gitbj.haihangyun.com/api/v4',
    privateToken: 'zxwDdcKGhwwxBGyS6D1y',
    targetBranch: 'release_test',
    codeReview: true,
    autoMerge: false,
    removeSourceBranch: false
  }
)

github(
  {
    ...task,
    repository: {
      type: 'git',
      url: 'https://github.com/yanuoda/nidle-demo',
      branch: 'daily/nidle',
      userName: 'chb.wang'
    }
  },
  {
    apiUrl: 'https://api.github.com',
    privateToken: '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',
    targetBranch: 'release',
    codeReview: true,
    autoMerge: false,
    removeSourceBranch: false
  }
)
