---
id: document
title: 文档编写
sidebar_position: 5
---

## 介绍
文档是基于 [Docusaurus 2](https://docusaurus.io/) 创建的，核心还是 markdown 文档，其为了生成文档站点本身，做了相关扩展，主要留意：
* 文档顶部 front matter: 支持设置 id、position。
*为了减少工作量，现在文档目录是自动生成的，所以position很重要*
* [mdx & react component](https://docusaurus.io/docs/markdown-features): 文档内置了一些 react 组件来扩展 markdown 的功能，如 Tab 等，具体写文档的时候参考官方文档。

## 目录结构
这里主要介绍 docs 下面的目录结构，其他 docusaurus 的目录结构参照官网文档。

```bash
nidle-site
├── docs
|   ├── document // 用户文档，后续补充
│   ├── developer // 内部开发文档，所以开发相关的约定、说明都放在这里
│   ├── Core // 调度器文档，后续补充
│   ├── Web // web应用文档，后续补充
│   ├── Plugin // 插件文档，后续补充
│   ├── CLI // cli文档，后续补充
```

前期我们主要关注 developer 目录，开发相关的约定、规范都放在这里

## 开发、发布
命令参考 READEME.md

### 发布
文档是通过 github page 发布，`yarn deplpy` 会自动将 `当时分支` 打包出文档并提交到 `gh-pages分支`，所以我们只需写好文档，命令发布即可
