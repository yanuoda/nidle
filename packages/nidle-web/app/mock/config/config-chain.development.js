module.exports = {
  name: 'test',
  extend: 'tmp-development',
  log: {
    path: '/app/test/'
  },
  output: {
    path: '/a/b/'
  },
  chain: function (config) {
    config.output.path('/a/b/c')
    config
      .stage('build')
      .timeout(1000)
      .step('example')
      .retry(3)
      .tap(options => {
        return {
          ...options,
          test: 'a'
        }
      })
  }
}
