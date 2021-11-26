// 模板配置
module.exports = {
  name: 'tmp-development', // 模板名称
  type: 'publish', // 任务类型: build/test/publish
  // 日志
  log: {
    path: '/xx/xx/' // 日志存放路径
  },
  // 输出、备份
  output: {
    backup: {
      path: '/xx/xx',
      maxCount: 3 // 备份最大数量
    },
    cache: {
      // 发布记录缓存，用来部署和失败重试
      path: '/xx/xx'
    }
  },
  stages: [
    {
      name: 'build',
      timeout: 0, // 超时结束，0则不超时
      // disabledParallel: false, // 是否关闭并行插件，关闭后并行插件会变成顺序执行
      steps: [
        {
          name: 'example',
          enable: true, // 插件开启与否
          package: 'example-plugin', // npm 模块名
          timeout: 0, // 超时结束，0则不超时
          retry: 0, // 失败重试，0则不重试
          options: {
            // 插件默认配置，最后会跟input整合，input优先
          }
        }
      ]
    }
  ]
}
