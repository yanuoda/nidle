---
id: config
title: 配置
sidebar_position: 2
---

## 任务配置说明
> 详细说明任务配置的继承、扩展机制（内置模板 > 团队模板 > 应用配置）

### 给任务器的最终配置
```javascript
// 给任务器的最终配置
module.exports = {
  name: 'app-name', // 应用名称
  repository: {
    // 从package.json 和 git信息获取
    type: 'git',
    url: 'http://xxx.xxx.com/xx/xx.git',
    branch: 'dev',
    userName: ''
  },
  type: 'publish', // 任务类型: build/test/publish
  // 日志
  log: {
    path: '/xx/xx/', // 日志存放路径
  },
  // 输出、备份
  output: {
    backup: {
      path: '/xx/xx',
      maxCount: 3, // 备份最大数量
    },
    cache: {
      // 发布记录缓存，用来部署和失败重试
      path: '/xx/xx' 
    },
    path: ''
  },
  // 插件input
  inputs: [
    {
      stage: '', // 阶段名称
      plugin: '', // 插件名称
      input: [
        // 插件要求输入项，参考inquirer
        {
          type: 'input',
          name: 'test',
          message: 'xxx'
        }
      ]
    }
  ],
  stages: [
    {
      name: 'build',
      timeout: 0, // 超时结束，0则不超时
      steps: [
        {
          name: '',
          enable: true, // 插件开启与否
          package: 'example-plugin', // npm 模块名
          path: './plugins/example-plugin.js', // 与 package 配置互斥，优先取 package,
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


```

### 模板配置
```javascript
// 模板配置
module.exports = {
  name: '', // 模板名称
  type: 'publish', // 任务类型: build/test/publish
  // 日志
  log: {
    path: '/xx/xx/', // 日志存放路径
  },
  // 输出、备份
  output: {
    backup: {
      path: '/xx/xx',
      maxCount: 3, // 备份最大数量
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
      disabledParallel: false, // 是否关闭并行插件，关闭后并行插件会变成顺序执行
      steps: [
        {
          name: '',
          enable: true, // 插件开启与否
          package: 'example-plugin', // npm 模块名
          path: './plugins/example-plugin.js', // 与 package 配置互斥，优先取 package,
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
```

### 应用配置
```javascript
// 应用配置
module.exports = {
  name: '应用名称',
  extend: '', // 模块扩展
  log: {},
  output: {},
  stages: [], // 不扩展的情况可以配
  chain: (config) => {
    // 可以像数组一样移除，新增
    config.stages.push({})
    // 修改指定stage的配置
    config.stage('xxx').set('timeout', 0)

    // 可以像数据一样移除、新增指定stage的steps
    config.stage('xxx').steps.push({})
    // 修改指定step的配置
    config.stage('xxx').step('xxx').set('timeout', 0)
    config.stage('xxx').step('xxx').options({})
  }
}
```
