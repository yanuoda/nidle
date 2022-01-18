module.exports = {
  name: 'gs-web',
  type: 'publish',
  mode: 'development',
  repository: {
    type: 'git',
    url: 'http://gitbj.haihangyun.com/ava/style-y8.git',
    branch: 'daily/nidle',
    userName: 'chb.wang',
    id: 1166
  },
  source: '/Users/wangchangbin/git/nidle-output/style-y8/',
  output: {
    path: '/Users/wangchangbin/git/nidle-output/output/gs-web/gs-web.test/',
    tarFileName: 'gs-web.test.tar.gz'
  },
  logger: {
    info: function (msg) {
      console.log('info:: ', msg)
    },
    error: function (msg) {
      console.error('error:: ', msg)
    }
  },
  event: {
    emit: function (msg, value) {
      console.log('event emit: ', msg, value)
    }
  }
}
