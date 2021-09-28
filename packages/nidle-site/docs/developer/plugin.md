---
id: plugin
sidebar_position: 3
---

# 插件开发
## 编写插件
Nidle的任务是通过插件去执行的，可以通过编写插件扩展自己的自动化部署流程。

## 创建插件
一个插件由以下构成

* 一个具名 JavaScript 函数。
* 在它的原型上定义 apply 方法。
* 在 apply 方法中往调度器 add、addParallel(挂载) 任务处理方法。
* 方法是个通过 `p-cancelable`封装的 可取消Promise 对象(*因为任务基本是异步的，特别是shell命令是在单独进程中异步处理的，需要在取消的时候主动kill掉*)，内部通过 task 实例可以获取到 构建相关内容，并可进行相应操作。
* 在实现功能后结束 Promise。

```javascript
const PCancelable = require('p-cancelable')

class ExamplePlugin {
  apply (scheduler) {
    // 串行任务
    scheduler.add('name', (task, config) => {
      return new PCancelable((resolve, reject, onCancel) => {
        // ... 
        onCancel(() => {
          // 取消异步操作
        })
      })
    })

    // 并行任务[Remove]
    scheduler.addParallel('name', (task, config) => {
      return new Promise((resolve, reject) => {
        // ...  
      })
    })
  }

  input () {
    // inquirer question list
    return [
      {
        type: 'input',
        name: 'test',
        message: 'xxx'
      }
    ]
  }
}
```

### add 挂载说明
* `add(name, callback)` - 添加串行方法，任务默认都是串行执行的
* ~~`addParallel(name, callback)` - 添加并行方法，当任务是完全独立并确认不会影响到后续流程时(如 图片压缩)，那么可以进行并行处理，以优化构建效率~~

:::danger
**暂不支持并行方法** 串行和并行方法内部实现是一致的，所以内部是可以混用；当任务阶段关闭并行执行时，系统会提示一个 warning 提示，将并行方法进行串行执行
:::

### input说明
input输入需要同时支持 `CLI` 和 `SPA` 端，所以我们进行了以下技术选型：
* `CLI端` - 基于强大的 [inquirer](https://www.npmjs.com/package/inquirer) 交互式命令行
* `SPA端` - 基于阿里的 [XRender](https://x-render.gitee.io/form-render) 配置化表单生成方案

为了同一配置支持两端，我们做了以下取舍
* `inquirer`的输入类型相对于 `form` 少，为了减少适配成本，所以优先考虑支持 `inquirer`
* 在 `SPA端` 我们需要对 `inquirer question` 进行一次转换，转换成 `schema`
* 因为每个插件都可能有 `input`，输入的时候需要进行分组，所以
  * `inquirer` 需要在 `question name` = `${plugin.name}-${question.name}`
  * `SPA端` 需要对输入项进行分组

### task实例
```js
{
  name: '', // 应用名
  repository: {
    // git repository
  },
  type: 'publish', // 构建类型, default `publish`
  output: {
    path: '' // 源代码目录
  },
  logger: logger // 日志
}
```

### 日志说明
#### levels
* info
* warning\
如果没有报错，但是存在警告，一定要warning，前台会展示
* error
* fatal

#### 长任务脚本实时输出日志
```js
import execa from 'execa'

const subprocess = execa('', {
  shell: true
})

subprocess.stdout.on('data', data => {
  logger.info({
    name: '',
    detail: data.toString()
  })
})

subprocess.stderr.on('data', data => {
  logger.error({
    name: '',
    error: {
      message: data.toString()
    }
  })
})
```

:::caution
像`git`或者`npm`一些命令，即使`error`也只是`stdout`，所以要注意处理错误情况
:::
