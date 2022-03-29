module.exports = {
  name: 'style-y8',
  type: 'publish',
  source: '/Users/wangchangbin/git/nidle-output/style-y8/',
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
