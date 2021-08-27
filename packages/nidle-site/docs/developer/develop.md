---
id: develop
title: MonoRepo 项目开发
sidebar_position: 6
---

以下是常见的 `MonoRepo` 仓库目录结构：
```bash
monorepo-root/    # monorepo 项目根目录
  package.json    # 公共依赖
  packages/       # 所有子项目/子包的存放目录
    pkgA/
      package.json
    pkgB/
      package.json
    ...
```

在开始之前，先明确一些概念描述，保证大家理解一致：
- **公共依赖：**指的是需要添加在项目根目录的 `package.json` 文件内的依赖，一般包括打包构建、代码规范、提交规范相关的依赖...
- **子包/子项目：**指的是在 `packages` 目录（或其他指定在根目录 `package.json` 中 `workspaces` 字段下的目录）下的包（如上面的 `pkgA` 和 `pkgB`）

`MonoRepo` 项目的管理主要包括依赖管理和发布管理两部分内容。

### 依赖管理

:::tip

为了保证依赖安装和管理的一致性，我选择使用 `Yarn` 进行依赖管理。如果觉得 `Lerna` 的命令更简便可以去阅读其文档，但是最好不要混用，避免出现其他问题。

:::

#### 依赖安装

直接在项目根目录运行：
```bash
$ yarn
```

#### 添加/移除依赖

1. 添加/移除公共依赖，需要添加 `-W` 这个 `flag`，如果需要添加 `devDependencies`，则加上 `-D`：
```bash
$ yarn add/remove <dependency> -W [-D]
```
2. 添加/移除子包的依赖，需要使用 `yarn workspace` 命令：
```bash
$ yarn workspace <sub-package-name> add/remove <dependency> [-D]
```

#### 将子包添加为依赖

在 `MonoRepo` 项目里，其中一个子包是其他子包的依赖项是非常常见的情况，像上一节一样，通过 `yarn workspace` 命令添加，但是需要注意的一点是，依赖包需要明确指定版本号，否则 `yarn` 会从远程服务器拉取新的包，而不是使用本地 `link` 的子包：
```bash
# 假设 pkgA 依赖子包 pkgB，且 pkgB 此时的版本号为 0.1.1
$ yarn workspace pkgA add pkgB@0.1.1
```

### 发布管理

首先我们需要进行发布前的**构建（build）**，然后再执行发布命令：
```bash
# first
# 使用 lerna 运行子包的 npm script 是因为 lerna 会根据子包之间的依赖顺序执行命令
# 避免了某个子包的依赖子包还未构建就先进行构建
$ lerna run build
# next
$ lerna publish [major | minor | patch | premajor | preminor | prepatch | prerelease]
```
通过 `lerna` 的发布命令可以很方便地帮助我们执行一系列任务：
1. 为每个子包更新版本号
2. 生成 `changelog`
3. 自动提交代码，打上 `tag` 并推送到远程仓库
4. 将子包发布到 `npm`

:::tip

使用了自动生成 `changelog` 的功能后，发布时 `lerna` 不会再询问发布版本号，而是根据 `commit` 信息中的 `type` 去决定增加哪一位的版本号。但这不太符合我们的需求，尽管这符合语义化版本规范。所以使用发布命令时，尽量带上需要增加的版本位（即上面命令后面跟着的 `[major | minor | patch | premajor | preminor | prepatch | prerelease]`）

:::

### 其他常用命令

1. 创建新的子包，可以手动创建相应目录，也可以使用 `lerna` 提供的命令：
```bash
$ lerna create <sub-package-name>
```
2. 当我们需要运行某个子包的 `script` 时，可以：
```bash
$ yarn workspace <sub-package-name> run <script>
```
3. 当我们需要运行所有子包的 `script` 时，可以：
```bash
$ yarn workspaces run <script>
# 如果某个子包不存在这个 script，yarn 会报错，这种情况下可以使用 lerna
$ lerna run <script>
```
3. 清理所有子包的 `node_modules`：
```bash
$ lerna clean
```

### 代码提交

前期建议使用交互式代码提交的方式：
```bash
$ yarn cz
```
等到熟悉代码提交规范后，也可以直接使用：
```bash
$ git commit -m "<type>[(scope)]: <subject>"
```

提交信息中的 `type` 字段枚举：
```bash
- feat: 新功能
- fix: bug 修复
- docs: 文档更新
- chore: 对构建过程或辅助工具和库（如文档生成）的更改
- init: 初始提交
- style: 修改格式（空格，格式化，省略分号等），对代码运行没有影响
- refactor: 代码重构
- perf: 性能优化
- test: 添加测试
- revert: 撤销某个 commit
```

### 参考资料

- [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)
- [lerna](https://github.com/lerna/lerna)
- [Commit message 和 Change log 编写指南](https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)
