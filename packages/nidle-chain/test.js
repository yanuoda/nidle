const Config = require('./dist')
const newConfig = new Config()
const config = {
  name: 'uni-luckyair',
  mode: 'development',
  type: 'publish',
  stages: [
    {
      name: 'download',
      timeout: 0,
      steps: [
        {
          name: 'clone',
          enable: true,
          package: 'nidle-plugin-clone',
          timeout: 0,
          retry: 0
        },
        {
          name: 'nvm',
          enable: true,
          package: 'nidle-plugin-nvm',
          timeout: 0,
          retry: 0
        },
        {
          name: 'install',
          enable: true,
          package: 'nidle-plugin-install',
          timeout: 0,
          retry: 0
        },
        {
          name: 'eslint',
          enable: true,
          package: 'nidle-plugin-eslint',
          timeout: 0,
          retry: 0
        }
      ]
    },
    {
      name: 'build',
      timeout: 0,
      steps: [
        {
          name: 'build',
          enable: true,
          package: 'nidle-plugin-build',
          timeout: 0,
          retry: 0,
          options: {
            output: 'dist',
            buildShell: 'release.sh'
          }
        }
      ]
    },
    {
      name: 'publish',
      timeout: 0,
      steps: [
        {
          name: 'scp',
          enable: true,
          package: 'nidle-plugin-scp',
          timeout: 0,
          retry: 0,
          options: {
            decompress: true
          }
        }
      ]
    }
  ],
  extend: 'development-h5',
  source: '/Users/wangchangbin/git/nidle-output/source/uni-luckyair/uni-luckyair_1644457983889',
  output: {
    path: '/Users/wangchangbin/git/nidle-output/output/uni-luckyair/uni-luckyair_1644457983889',
    backup: {
      path: '/Users/wangchangbin/git/nidle-output/backup/uni-luckyair'
    }
  },
  log: {
    path: '/Users/wangchangbin/git/nidle-output/logs/uni-luckyair',
    all: '/Users/wangchangbin/git/nidle-output/logs/uni-luckyair/all_development_uni-luckyair_1644457983889.log',
    error: '/Users/wangchangbin/git/nidle-output/logs/uni-luckyair/error_development_uni-luckyair_1644457983889.log'
  }
}
newConfig.merge(config)
function chain(config) {
  console.log(config)
  console.log(22222, config.stage('publish'))
  console.log(33333, config.stage('publish').steps)
  config.stage('publish').step('merge-request').enable(true).package('nidle-plugin-merge').options({
    apiUrl: 'http://gitbj.haihangyun.com/api/v4',
    privateToken: 'zxwDdcKGhwwxBGyS6D1y',
    targetBranch: 'release',
    codeReview: true,
    autoMerge: false,
    removeSourceBranch: false
  })
  config.stage('aaaa').before('publish')
}
chain(newConfig)
console.log(JSON.stringify(newConfig.toConfig(), null, 2))
