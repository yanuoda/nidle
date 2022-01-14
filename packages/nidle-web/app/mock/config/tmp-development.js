// 模板配置
module.exports = {
  name: 'development', // 模板名称
  mode: 'development',
  type: 'publish', // 任务类型: build/test/publish
  // source: '/Users/wangchangbin/git/nidle-output/',
  // output: {
  //   backup: {
  //     path: '/Users/wangchangbin/git/nidle-output/backup/',
  //     maxCount: 1
  //   },
  //   path: '/Users/wangchangbin/git/nidle-output/output/'
  // },
  // log: {
  //   path: '/Users/wangchangbin/git/nidle-output/logs/'
  // },
  stages: [
    {
      name: 'download',
      timeout: 0, // 超时结束，0则不超时
      steps: [
        {
          name: 'clone',
          enable: true, // 插件开启与否
          package: 'nidle-clone', // npm 模块名
          timeout: 0, // 超时结束，0则不超时
          retry: 0
        },
        {
          name: 'nvm',
          enable: true, // 插件开启与否
          package: 'nidle-nvm', // npm 模块名
          timeout: 0, // 超时结束，0则不超时
          retry: 0
        },
        {
          name: 'install',
          enable: true, // 插件开启与否
          package: 'nidle-install', // npm 模块名
          timeout: 0, // 超时结束，0则不超时
          retry: 0
        },
        {
          name: 'eslint',
          enable: true, // 插件开启与否
          package: 'nidle-eslint', // npm 模块名
          timeout: 0, // 超时结束，0则不超时
          retry: 0
        }
      ]
    },
    {
      name: 'build',
      timeout: 0, // 超时结束，0则不超时
      steps: [
        {
          name: 'build',
          enable: true, // 插件开启与否
          package: 'nidle-build', // npm 模块名
          timeout: 0, // 超时结束，0则不超时
          retry: 0
        },
        {
          name: 'escheck',
          enable: true, // 插件开启与否
          package: 'nidle-escheck', // npm 模块名
          timeout: 0, // 超时结束，0则不超时
          retry: 0
        }
      ]
    },
    {
      name: 'publish',
      timeout: 0, // 超时结束，0则不超时
      steps: [
        {
          name: 'scp',
          enable: true, // 插件开启与否
          package: 'nidle-scp', // npm 模块名
          timeout: 0, // 超时结束，0则不超时
          retry: 0
        }
      ]
    }
  ]
}
