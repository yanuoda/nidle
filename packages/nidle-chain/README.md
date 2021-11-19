# nidle-chain

应用一个链式 API 来生成和简化 nidle 的配置的修改。

参考自[webpack-chain](https://www.npmjs.com/package/webpack-chain)

## 介绍

nidle 的核心配置是一些 JavaScript 对象或数组，虽然不像 webpack 配置那么复杂，但是也需要提供一些简单的 API 去更细力度地控制其内部配置。

`nidle-chain` 尝试通过提供可链式或顺流式的 API 创建和修改 nidle 配置。API 的 Key 部分可以由用户指定的名称引用，这有助于 跨项目修改配置方式 的标准化。

通过以下示例可以更容易地解释这一点。

## 安装

你可以使用 Yarn 或者 npm 来安装此软件包（俩个包管理工具选一个就行）：

### **Yarn 方式**

```bash
yarn add --dev nidle-chain
```

### **npm 方式**

```bash
npm install --save-dev nidle-chain
```

## 入门

当你安装了 `nidle-chain`， 你就可以开始创建一个 nidle 的配置。

```js
// 导入 nidle-chain 模块，该模块导出了一个用于创建一个 nidle 配置API的单一构造函数。
const Config = require('nidle-chain')

// 对该单一构造函数创建一个新的配置实例
const config = new Config()

// 用链式API改变配置
// 每个API的调用都会跟踪对存储配置的更改。

config
  // 修改 mode 配置
  .mode('development')
  // 修改 日志 配置
  .log({
    path: 'a.log'
  })
  // 修改 output 配置
  .output.path('dist')
  .backup({
    path: '/xx/xx/'
  })

// 创建 stage
config
  .stage('build')
  .timeout(10000)
  // 创建 step
  .step('lint')
  .package('nidle-plugin-lint')
  // 修改插件配置
  .tap(options => {
    return {
      ...options,
      newOption: 'test'
    }
  })

// 导出这个修改完成的要被webpack使用的配置对象
module.exports = config.toConfig()
```

想修改原有配置也很简单。

```js
const Config = require('nidle-chain')
const config = new Config()

// merge 原有配置
config.merge({
  mode: 'development',
  log: {
    path: 'a.log'
  }
})

// 修改配置
config.log({
  path: 'b.log'
})

module.exports = config.toConfig()
```

## ChainedMap

nidle-chain 中的核心 API 接口之一是 `ChainedMap`. 一个 `ChainedMap`的操作类似于 JavaScript Map, 为链式和生成配置提供了一些便利。 如果一个属性被标记一个 `ChainedMap`, 则它将具有如下的 API 和方法:

**除非另有说明，否则这些方法将返回 `ChainedMap` , 允许链式调用这些方法。**

```js
// 从 Map 移除所有 配置.
clear()
```

```js
// 通过键值从 Map 移除单个配置.
// key: *
delete key
```

```js
// 获取 Map 中相应键的值
// key: *
// returns: value
get(key)
```

```js
// 获取 Map 中相应键的值
// 如果键在Map中不存在，则ChainedMap中该键的值会被配置为fn的返回值.
// key: *
// fn: Function () -> value
// returns: value
getOrCompute(key, fn)
```

```js
// 配置Map中 已存在的键的值
// key: *
// value: *
set(key, value)
```

```js
// Map中是否存在一个配置值的特定键，返回 真或假
// key: *
// returns: Boolean
has(key)
```

```js
// 返回 Map中已存储的所有值的数组
// returns: Array
values()
```

```js
// 返回Map中全部配置的一个对象, 其中 键是这个对象属性，值是相应键的值，
// 如果Map是空，返回 `undefined`
// 使用 `.before() 或 .after()` 的ChainedMap, 则将按照属性名进行排序。
// returns: Object, undefined if empty
entries()
```

```js
//  提供一个对象，这个对象的属性和值将 映射进 Map。
// 你也可以提供一个数组作为第二个参数以便忽略合并的属性名称。
// obj: Object
// omit: Optional Array
merge(obj, omit)
```

```js
// 对当前配置上下文执行函数。
// handler: Function -> ChainedMap
// 一个把ChainedMap实例作为单个参数的函数
batch(handler)
```

```js
// 条件执行一个函数去继续配置
// condition: Boolean
// whenTruthy: Function -> ChainedMap
// 当条件为真，调用把ChainedMap实例作为单一参数传入的函数
// whenFalsy: Optional Function -> ChainedMap
// 当条件为假，调用把ChainedMap实例作为单一参数传入的函数
when(condition, whenTruthy, whenFalsy)
```

## 速记方法

存在许多简写方法，用于 使用与简写方法名称相同的键在 ChainedMap 设置一个值
例如, `output.path` 是一个速记方法, 因此它可以用作:

```js
// 在 ChainedMap 上设置一个值的 速记方法
output.path('a.log')

// 上述方法等效于:
devServer.set('path', 'a.log')
```

一个速记方法是可链式的，因此调用它将返回 原实例，允许你继续链式使用

#### 配置速记方法

```js
config
  .mode(mode)
  .log({
    ...logConfig
  })
  .output.backup({})
  .cache({})
  .path('')
  .end()
  .stage(stageName)
  .timeout(0)
  .step(stepName)
  .timeout(0)
  .retry(0)
  .enable(true)
  .tap(options => {
    return modifyOptions
  })
```

#### 配置 stage step 插入顺序

指定当前插件上下文应该在另一个指定插件之前执行，你不能在同一个插件上同时使用 `.before()` 和 `.after()`。

```js
// stage
config.stage(name).before(otherName)

// step
config.stage(name).step(name).after(otherName)
```
