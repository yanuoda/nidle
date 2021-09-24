# nidle-core

nidle 任务调度器

## Features

- Task System\
  配置化，可开关、重试、超时控制
- Plugin\
  任务是通过插件去执行的，可以通过编写插件扩展自己的自动化部署流程。
  - Plugin Input\
    插件可定制配置，基于`inquirer question`; Nidle CLI or Nidle App 会基于它向用户索要配置
- Logger\
  日志记录任务运行步骤、结果，并提供实例给插件记录任务日志
- Cache & Backup\
  缓存&备份构建结果，支持失败重试或回滚
- 内置了一套基础通用的自动化发布流程

## Install

```
yarn install nidle
npm install nidle
```

## Usage

```js
import Nidle from 'nidle'

const scheduler = new Nidle({ ...options })

// 初始化，获取所有任务插件input，用于询问用户配置
const inputs = await scheduler.init()

// After User Input
// 挂载：将插件挂载到任务调度器
await scheduler.mount([...userInputs])

// 任务开始
await scheduler.start(0)
```

## API

### Nidle(options)

Return a new `nidle` instance, which is an [`EventEmitter3`](https://github.com/primus/eventemitter3) subclass.

#### options

Type: `object`

##### name

构建应用名，一般为`package.json name`

Type: `string`

##### repository

git repository

Type: `object`\
Example:

```js
{
  type: 'git',
  url: 'http://xxx.xxx.com/xx/xx.git',
  branch: 'dev', // 构建分支
  userName: 'chb.wang' // 提交构建用户
}
```

##### type

Type: `string`\
Default: `publish`

##### log

logger config

Type: `object`\
Example:

```js
{
  path: '' // 日志存放目录
}
```

##### output

Type: `object`\
Example:

```js
{
  // 备份
  backup: {
    path: '', // 备份目录
    maxCount: 2 // 最多保留多少备份
  },
  // 缓存
  cache: {
    path: '' // 缓存目录
  },
  path: '' // 构建目录
}
```

##### stages

任务队列 - stage

Type: `Array`
Example:

```js
[
  {
    name: 'build', // stage name
    timeout: 0, // 该阶段任务运行时长超过timeout时，会自动结束任务，任务失败；默认为0，不设置超时时间
    steps: [ // stage steps
      {
        name: 'download', // step name
        enable: true, // enable = false将调过该步骤
        path: '', // path & package 二选一，本地插件包
        package: '', // path & package 二选一，npm插件包
        options: { // step default input option
          ...
        }
      }
    ]
  },
  ...
]
```

### nidle

`Nilde` instance.

#### async .init()

初始化，获取所有任务插件 input，用于询问用户配置

Return: `object`

```js
{
  inputs: []
}
```

#### async .mount(inputs?)

After User Input，将插件挂载到任务调度器

##### inputs

Type: `array`\
Example:

```js
[
  {
    stage: '', // stage name
    plugin: '', // plugin name
    options: { // plugin input option
      ...
    }
  }
]
```

#### async .start(index?)

开始执行任务

##### index

Type: `number`\
default: `0`

#### async .rollback()

回滚. 从备份中恢复相应部署结果，然后开始部署；如果备份已失效，将抛出错误，由应用重试开始分支发布

## Events

#### completed

Emitted when task all completed without error.

#### error

Emitted if an task throws an error.
