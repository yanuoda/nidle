module.exports = {
  name: 'style-y8',
  type: 'publish',
  repository: {
    type: 'git',
    url: 'http://gitbj.haihangyun.com/ava/style-y8.git',
    branch: 'daily/nidle1',
    userName: 'chb.wang'
  },
  source: '/Users/wangchangbin/git/nidle-output/source/style-y8/',
  logger: {
    info: function (msg) {
      console.log('info:: ', msg)
    },
    error: function (msg) {
      console.error('error:: ', msg)
    }
  }
}
