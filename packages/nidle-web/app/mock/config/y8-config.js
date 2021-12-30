module.exports = {
  name: 'style-y8', // 模板名称
  mode: 'development',
  type: 'publish', // 任务类型: build/test/publish
  repository: {
    type: 'git',
    url: 'http://gitbj.haihangyun.com/ava/style-y8.git',
    branch: 'daily/nidle',
    userName: 'chb.wang'
  },
  source: 'style-y8',
  output: {
    backup: {
      path: 'style-y8',
      maxCount: 3 // 备份最大数量
    },
    path: 'style-y8'
  },
  // 日志
  log: {
    path: 'style-y8' // 日志存放路径
  },
  // 私密信息，只给标记安全的step
  privacy: {
    server: [
      {
        ip: '10.70.73.105',
        output: '/frontend/y8air',
        username: 'root',
        password: 'jd@sit'
      }
    ]
  },
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
          retry: 0,
          options: {
            output: './dist/*',
            buildShell: './release.sh'
          }
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
          retry: 0,
          secure: true
        }
      ]
    }
  ],
  update(model) {
    console.log('update: ', model)
  }
}
