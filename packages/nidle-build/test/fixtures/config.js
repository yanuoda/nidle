module.exports = {
  name: 'style-y8',
  mode: 'development',
  type: 'publish',
  repository: {
    type: 'git',
    url: 'http://gitbj.haihangyun.com/ava/style-y8.git',
    branch: 'daily/nidle',
    userName: 'chb.wang'
  },
  source: '/Users/wangchangbin/git/nidle-output/style-y8/',
  output: {
    path: '/Users/wangchangbin/git/nidle-output/output/style-y8_1640163653371'
  },
  processOptions: {
    execPath: '/Users/wangchangbin/.nvm/versions/node/v8.17.0/bin/node'
    // execPath: process.execPath
  },
  logger: {
    info: function (msg) {
      console.log('info:: ', msg)
    },
    error: function (msg) {
      console.error('error:: ', msg)
    },
    warn: function (msg) {
      console.log('warn:: ', msg)
    }
  }
}
