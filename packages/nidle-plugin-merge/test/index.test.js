const merge = require('../lib')
const task = require('./fixtures/config')

merge(task, {
  apiUrl: 'http://gitbj.haihangyun.com/api/v4',
  privateToken: 'zxwDdcKGhwwxBGyS6D1y',
  targetBranch: 'release_test',
  codeReview: true,
  autoMerge: false,
  removeSourceBranch: false
})
