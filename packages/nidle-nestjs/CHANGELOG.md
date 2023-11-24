# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.2.5-alpha.0](https://github.com/yanuoda/nidle/compare/v0.2.4-alpha.0...v0.2.5-alpha.0) (2023-11-24)

**Note:** Version bump only for package nidle-nestjs





## [0.2.4-alpha.0](https://github.com/yanuoda/nidle/compare/v0.2.3-alpha.0...v0.2.4-alpha.0) (2023-11-24)


### Bug Fixes

* 发布配置函数运行错误捕获日志 ([911ed75](https://github.com/yanuoda/nidle/commit/911ed758102ba60ca263f8425399ed23d43ea662))
* 删除发布-重命名文件时先判断文件是否存在 ([45a5a88](https://github.com/yanuoda/nidle/commit/45a5a881d6b7a106cd3c20c82c811f2e4ee94736))
* 生产环境的webhook发布不释放资源占用 ([1ed09d5](https://github.com/yanuoda/nidle/commit/1ed09d566e7be31a44c7488e3145a82d50100ce9))
* 子进程 progress 方法调用 ([8c23525](https://github.com/yanuoda/nidle/commit/8c23525cbe08f423d95c8fc2acb99815254a5b9b))
* 子进程progress error log ([ac7f760](https://github.com/yanuoda/nidle/commit/ac7f760e0628699317c1b54c59b963193c2c764d))
* queue on stalled event ([a856736](https://github.com/yanuoda/nidle/commit/a85673682df5c4fa7be43f34b60bf352c591acf7))
* webhook 重新发布对应环境；发布记录字段文案调整 ([79f2f4b](https://github.com/yanuoda/nidle/commit/79f2f4b7e20bcdc3ff83e688c212e2176f464b4b))
* webhook响应失败时发送通知 ([6b7999e](https://github.com/yanuoda/nidle/commit/6b7999ed7e40aab8d9b629078f272cce619e98d7))


### Features

* 创建发布 - 分支查询优化 ([ee13156](https://github.com/yanuoda/nidle/commit/ee13156b5add5e55fdd1da23387c449906f28a57))
* 调整queue配置 maxStalledCount ([2b021f8](https://github.com/yanuoda/nidle/commit/2b021f826bcd8c3b6fbd18e980642e50a0f05706))
* 队列任务切换子进程 ([6b11583](https://github.com/yanuoda/nidle/commit/6b11583d69df775b5e42ea4edb221fab381576d1))
* 发布记录查询重构为分组分页查询 ([0fc34c7](https://github.com/yanuoda/nidle/commit/0fc34c7e4f4cdc601e73231449f327df760e7516))
* 获取队列运行信息、函数调用 ([c6060df](https://github.com/yanuoda/nidle/commit/c6060df5e1d077e324f15caf06505612461fb68a))
* 自动发布流程手动确认功能 ([8200d82](https://github.com/yanuoda/nidle/commit/8200d827c32d6ffcbe1d264dcbd75634f905efa5))
* 自动发布流程暂缓MR时推送通知 ([913dc4d](https://github.com/yanuoda/nidle/commit/913dc4d3a0f83ea161026c36bef30e7a9112e1d9))
* 子进程任务参数配置化；队列 lockDuration调整 ([b8d962a](https://github.com/yanuoda/nidle/commit/b8d962aa322784276c0d2eea6afebc89b67c56c6))
* 子进程运行队列任务 ([59c2678](https://github.com/yanuoda/nidle/commit/59c26784d1954f64402e9802eab563437b68849e))
* callJobMethodBy update ([2895642](https://github.com/yanuoda/nidle/commit/2895642fd87e6d4366a4428bc1c1e6c52010b0a4))
* webhook发布插入手动确认流程 ([32644af](https://github.com/yanuoda/nidle/commit/32644afbc303ddf102e5bf3b235733da0d702a75))





## [0.2.3-alpha.0](https://github.com/yanuoda/nidle/compare/v0.2.2-alpha.0...v0.2.3-alpha.0) (2023-11-09)


### Bug Fixes

* 表字段length ([146b7d7](https://github.com/yanuoda/nidle/commit/146b7d78504ddbd1bde77f1ab0b11dd438d35165))
* 代码提交错误 ([04101ec](https://github.com/yanuoda/nidle/commit/04101ece874e695f5b65c48ce801f0b5e0a8adf4))
* 构建任务并发策略变更 ([b84b5ba](https://github.com/yanuoda/nidle/commit/b84b5bac0b9711f367435a7ef8f3328aa1beb0b0))
* 删除发布记录时的重命名文件判断 ([ddec9b9](https://github.com/yanuoda/nidle/commit/ddec9b90d2c6016fa09bebeed9d0f814311837a1))
* session user 判断 ([f5d509a](https://github.com/yanuoda/nidle/commit/f5d509ac1109e098a9614f44b5234daabb8b1c37))


### Features

* 发布记录删除功能（物理）；相关配置、日志文件重命名为'.bak' ([3b74104](https://github.com/yanuoda/nidle/commit/3b74104d288a23195aced725cbd02cc7314e3f1f))
* 构建任务完成时根据 stalled 手动变更 job 状态 ([c17f847](https://github.com/yanuoda/nidle/commit/c17f84728f4c5feae86c96cf2e4fb1594b5d06ee))
* 删除操作日志 ([5435f6d](https://github.com/yanuoda/nidle/commit/5435f6d6c94caf4daece28f6262a505edb4bf754))
* 刷新登录cookie过期时间；fix crypto 包引入错误 ([1dab358](https://github.com/yanuoda/nidle/commit/1dab358c8955a52caa39b57ce298b3be8ac4f1c6))
* 通知信息增加发布id、描述 ([c5110de](https://github.com/yanuoda/nidle/commit/c5110defda411af9dc9dc16f9b7279b86c174fdf))
* job 操作及日志优化 ([8ec5dc6](https://github.com/yanuoda/nidle/commit/8ec5dc6f254bf7072695c01c8f6ff367dc656c73))
* queue on global:stalled ([42baf82](https://github.com/yanuoda/nidle/commit/42baf8236d28cf3537d4df892afb417e363bf21a))





## [0.2.1-alpha.0](https://github.com/yanuoda/nidle/compare/v0.2.0-alpha.0...v0.2.1-alpha.0) (2023-08-10)


### Bug Fixes

* remove locker ([4bf2df5](https://github.com/yanuoda/nidle/commit/4bf2df5926331a40ff343b265cee543f8fd5248a))





# [0.2.0-alpha.0](https://github.com/yanuoda/nidle/compare/v0.1.8...v0.2.0-alpha.0) (2023-08-10)


### Bug Fixes

* 本地环境调试问题修复 ([f29252a](https://github.com/yanuoda/nidle/commit/f29252a742e6c6670c5f3ab6e259e8c391d79565))
* 本地运行调试错误修复 ([767d7b8](https://github.com/yanuoda/nidle/commit/767d7b8f54e7ea47daa20edc1ad80291a10c6c8d))
* 本地运行调试问题修复 ([454f848](https://github.com/yanuoda/nidle/commit/454f848c2993bf8d313dfb34ed8793589dfb1c48))
* 分页查询参数有效判断；where对象组装判断 ([70adebf](https://github.com/yanuoda/nidle/commit/70adebf9da3f070225638f720ce7bc4740199604))
* asyncWait util bug; queue reject error set ([84136bd](https://github.com/yanuoda/nidle/commit/84136bdd7aa1916d470e92d16a359e39e2bbd516))
* circular dependency ([776404d](https://github.com/yanuoda/nidle/commit/776404d634305b790a0d6b1fd13494f5a6322a4b))
* environment enum ([1f545c0](https://github.com/yanuoda/nidle/commit/1f545c0f66df702f1438aef1e098f8f93dd92d05))
* gitlab授权链接 ([2b8e3bf](https://github.com/yanuoda/nidle/commit/2b8e3bfbd5702547d645deeeb677ff42b862f7ba))
* redis config ([ef58eca](https://github.com/yanuoda/nidle/commit/ef58eca1a101d1d527baf557add1e48d4c86c7e0))
* redis host; publish list children set ([e78c98a](https://github.com/yanuoda/nidle/commit/e78c98a2f4b631ede8196f80423c4b7f41e3db84))
* server表时间格式 ([a2abeab](https://github.com/yanuoda/nidle/commit/a2abeabe39817b479e2a2256567a851f33e093d2))
* template status默认值设置 ([1f2fdae](https://github.com/yanuoda/nidle/commit/1f2fdae1ff37819a96535b4d41095a583d4a0e75))
* user module swagger info ([c48c61b](https://github.com/yanuoda/nidle/commit/c48c61b854f6730fcb4da77f53438b28fbe91826))


### Features

* 服务器模块CRUD ([e0a5fb0](https://github.com/yanuoda/nidle/commit/e0a5fb0053ae192ebeec0ce312e9cf4f0ec00cef))
* 数据库链接配置 ([33a974d](https://github.com/yanuoda/nidle/commit/33a974d87ccb2bcc60ba308058c29ede5aa8d025))
* 添加 BullBoard 插件；修改接口前缀注册 ([b93dcc9](https://github.com/yanuoda/nidle/commit/b93dcc9c5dfc2d3fcd17067beba1d8d3c22e1a7f))
* 增加 host 配置 ([0f998cc](https://github.com/yanuoda/nidle/commit/0f998cce85d1275c95963543e1092d8818f77b6d))
* 增加interceptor和filter统一处理response格式及错误捕获返回格式 ([a0e0eb6](https://github.com/yanuoda/nidle/commit/a0e0eb60935292efb0ad2162b70fa27f7a1e5d19))
* auto validation pipe ([5daa47b](https://github.com/yanuoda/nidle/commit/5daa47b666ec1eb0efd6f02b2a4e65a0da0ee9e0))
* changelog features ([40abeb4](https://github.com/yanuoda/nidle/commit/40abeb4c310ea5116e939e49fe3551879db364bb))
* changelog、config module feature ([b975f69](https://github.com/yanuoda/nidle/commit/b975f69020087554f09076a12937b66c036643ab))
* lib module - gitlab service ([c38b435](https://github.com/yanuoda/nidle/commit/c38b4357cdf22d953bd85a0491a3bf44b155cd67))
* oauth config & hbs engine ([af91ba9](https://github.com/yanuoda/nidle/commit/af91ba9f7bbe1b3ddadefa42c25bf16be0183ff3))
* oauth module ([50e375f](https://github.com/yanuoda/nidle/commit/50e375fa4535bb904bf32b1efe105c7595484287))
* project features ([c94dbd8](https://github.com/yanuoda/nidle/commit/c94dbd803d8a8fbc6b675d8161a4d3154222a9e1))
* project module CRUD ([3a0c239](https://github.com/yanuoda/nidle/commit/3a0c23975520dab6cd066f35b4a777ba3aa78923))
* project_server module ([19270b2](https://github.com/yanuoda/nidle/commit/19270b2907ca95fe37a6055ff2a7bf83f847e9c6))
* project_server table and relations ([0bb2e3b](https://github.com/yanuoda/nidle/commit/0bb2e3b241ebe0e72d83759039f6f7691ad58d73))
* server 获取所有服务器数据用于下拉框 ([5060882](https://github.com/yanuoda/nidle/commit/5060882977c1de4dfb2bbfee5366db96af1ad771))
* template module CRUD ([72bd562](https://github.com/yanuoda/nidle/commit/72bd562df81c3ac28919dfd20f4027f85fcb1c79))
* user register ([f74de3d](https://github.com/yanuoda/nidle/commit/f74de3d41b8b2d5c9ca14e0e987d49fa7b551513))
* user模块；登录登出session ([34d2a8a](https://github.com/yanuoda/nidle/commit/34d2a8adb3086b7e7cc8d6ef302906e8b4acd856))
* winston logger ([8599e14](https://github.com/yanuoda/nidle/commit/8599e14cca33690505659a71594654bf20be860f))
* winston logs output ([fb68ec2](https://github.com/yanuoda/nidle/commit/fb68ec2eb0a65da95ec2fa0be5174c99e41b7509))
* wip-server 模块 ([a4e9b93](https://github.com/yanuoda/nidle/commit/a4e9b93e1efc8daaf281950254cbf2c8e4c2b7c4))
