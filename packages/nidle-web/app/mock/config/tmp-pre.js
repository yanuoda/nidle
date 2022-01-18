// 模板配置
module.exports = {
  name: 'pre', // 模板名称
  mode: 'pre',
  type: 'publish', // 任务类型: build/test/publish
  stages: [
    {
      name: 'publish',
      timeout: 0, // 超时结束，0则不超时
      steps: [
        {
          name: 'scp',
          enable: true, // 插件开启与否
          package: 'nidle-plugin-scp', // npm 模块名
          timeout: 0, // 超时结束，0则不超时
          retry: 0,
          secure: true
        }
      ]
    }
  ]
}
