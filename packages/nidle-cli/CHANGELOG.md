# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.2.7-alpha.0](https://github.com/yanuoda/nidle/compare/v0.2.6-alpha.0...v0.2.7-alpha.0) (2023-11-24)

**Note:** Version bump only for package nidle-cli





## [0.2.6-alpha.0](https://github.com/yanuoda/nidle/compare/v0.2.5-alpha.0...v0.2.6-alpha.0) (2023-11-24)

**Note:** Version bump only for package nidle-cli





## [0.2.5-alpha.0](https://github.com/yanuoda/nidle/compare/v0.2.4-alpha.0...v0.2.5-alpha.0) (2023-11-24)

**Note:** Version bump only for package nidle-cli





## [0.2.3-alpha.0](https://github.com/yanuoda/nidle/compare/v0.2.2-alpha.0...v0.2.3-alpha.0) (2023-11-09)

**Note:** Version bump only for package nidle-cli





# [0.2.0-alpha.0](https://github.com/yanuoda/nidle/compare/v0.1.8...v0.2.0-alpha.0) (2023-08-10)


### Bug Fixes

* 去掉文件拷贝步骤不必要的入参 ([6d6351f](https://github.com/yanuoda/nidle/commit/6d6351fbf6f1beefcc280fb773ce9aca928d83fe))
* 使用 Array.some 方法时未返回值 ([1ef64a3](https://github.com/yanuoda/nidle/commit/1ef64a3de2a326d36d7c68c4b2d81c509ad3f04e))
* 修复 nidle-web 服务 IP 和端口配置不生效的问题 ([35a4c36](https://github.com/yanuoda/nidle/commit/35a4c36b2495ffd118f0b8d83fed90a88f5a54a5))
* 修复安装 nidle 流前置步骤错误 ([e5ee1ce](https://github.com/yanuoda/nidle/commit/e5ee1ced4f04b5293d4dcb5f91ed7a7ba0ce0a53))
* 修复更新时获取已安装版本不正确的问题 ([07b5114](https://github.com/yanuoda/nidle/commit/07b5114dd3d90a67fc53a04a9b981e9051959cf0))
* 修复依赖 diff 时报错且未输出错误信息的问题 ([874be23](https://github.com/yanuoda/nidle/commit/874be2317cc51d538b014c0be6def903a270a040))
* 修复依赖 diff 问题及代码优化 ([e443a98](https://github.com/yanuoda/nidle/commit/e443a98f5ae07a2e7bc82efa91a5f56460a30af6))
* 一键安装 setup 命令未指定版本时默认安装最新版 ([b3f5fcc](https://github.com/yanuoda/nidle/commit/b3f5fcc8dd3a75110a995c20c5024794ba58a803))
* 一键更新时对 nidle-spa 的 dev 依赖项也要做 diff ([e03dc95](https://github.com/yanuoda/nidle/commit/e03dc9579e54d61402050d911aa6e2951afc7b2b))
* cp 命令添加 -f 选项 ([1bca602](https://github.com/yanuoda/nidle/commit/1bca6028339ba0bc726e27b9627c3392335fe8d4))
* nidle-cli 对比依赖遗漏了新版新增依赖的情况 ([3edd85a](https://github.com/yanuoda/nidle/commit/3edd85a4e9904db70fc0bda9cad73f6f1ff3ea72))
* nidle-cli 更新版本时，先对依赖进行 merge 再 diff ([17a3a11](https://github.com/yanuoda/nidle/commit/17a3a115c65df78090d450f8b7f9cbe678ad3ef7))


### Features

* 添加 nidle-cli 安装及更新详细信息选项 --showinfo ([b0a1f40](https://github.com/yanuoda/nidle/commit/b0a1f400ce0cc80d31b05c9b8e191385fb30aa6d))
* 添加服务启动成功提示信息及安装命令添加指定版本 flag ([7185212](https://github.com/yanuoda/nidle/commit/7185212898a23ce9539f09c0ab1f07685ca38159))
* 完成 setup 命令断点续装功能 ([b94b998](https://github.com/yanuoda/nidle/commit/b94b998dcfd696bf468d25047d2c93e5f177aa6c))
* 完成 update 命令断点续装功能 ([ed24bc8](https://github.com/yanuoda/nidle/commit/ed24bc8b05fd0afa353c510599b8bfd2d6ab0432))
* nidle-cli 日志输出优化 ([17bdcba](https://github.com/yanuoda/nidle/commit/17bdcba9881ee3be7c19a7bc01990de448aaf35a))
* nidle-web 添加对 nidle-cli 的依赖版本范围功能 ([6b7e10c](https://github.com/yanuoda/nidle/commit/6b7e10c5e6d369fd07ddce63882a4fae9d523ced))
