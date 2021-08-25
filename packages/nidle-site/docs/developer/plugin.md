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
* 方法是个 Promise 对象，内部通过 task 实例可以获取到 构建相关内容，并可进行相应操作。
* 在实现功能后结束 Promise。

```javascript
class ExamplePlugin {
  apply (scheduler) {
    // 串行任务
    scheduler.add('name', (task, config) => {
      return new Promise((reject, resolve) => {
        // ...  
      })
    })

    // 并行任务
    scheduler.addParallel('name', (task, config) => {
      return new Promise((reject, resolve) => {
        // ...  
      })
    })
  }

  input () {

  }
}
```
