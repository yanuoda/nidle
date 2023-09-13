## [0.2.1-beta.0](https://github.com/yanuoda/nidle/compare/v0.2.1-alpha.0...v0.2.1-beta.0) (2023-09-13)


### Bug Fixes

* 调试接口问题修复 ([4341eac](https://github.com/yanuoda/nidle/commit/4341eac4bd62f9d96e031bf2a474384c98d1232c))
* 更新部分接口返回数据 ([10d47dc](https://github.com/yanuoda/nidle/commit/10d47dc3b45a6d74006554cee6f5fd58e1d8dd33))
* 关联表查询 ([054ad21](https://github.com/yanuoda/nidle/commit/054ad21695e25439fb999b729c275c8bda3484c3))
* 接口调试问题修复 ([db4218e](https://github.com/yanuoda/nidle/commit/db4218e6103cb3bed8fee9f5fb8b999a0df4eb91))
* 区分 SWAGGER、DEV；部署开始通知广播所有人 ([2f3d887](https://github.com/yanuoda/nidle/commit/2f3d887eda9a59899d905e682edbbfa6d42f4503))
* 通过事件广播消息 ([c8e91ce](https://github.com/yanuoda/nidle/commit/c8e91ce468e8644dfd8aa4eb57e53765bf385c03))
* 消息通知 ([13c49f9](https://github.com/yanuoda/nidle/commit/13c49f9b487d309fdea20b51c76db2732e59b73f))
* 移除已关闭的sse ([9310d0f](https://github.com/yanuoda/nidle/commit/9310d0fc6627b521963c06200fc0dfd1eccd62e1))
* changelog - 在某记录上新建时，复用 description ([8120361](https://github.com/yanuoda/nidle/commit/812036171ae11947480164009459a69318bedc5c))
* configModule - getAppConfig missing logic ([7e80299](https://github.com/yanuoda/nidle/commit/7e8029947340e5c6d64919fd74c01dd8cfa50ca0))
* err stringify;应用服务器占用释放时机 ([a89a2a8](https://github.com/yanuoda/nidle/commit/a89a2a8087640d8dacd70dc8edfe29fd2ce3c2a5))
* Error对象 stringify ([cfbf438](https://github.com/yanuoda/nidle/commit/cfbf438ae33dd7bbbcba51357927c56f2b834886))
* findOne where条件校验 ([e068284](https://github.com/yanuoda/nidle/commit/e06828402575d918525c79d81f0d73e6b2ed091a))
* git merge hook 过滤处于新建状态的发布 ([38bce0d](https://github.com/yanuoda/nidle/commit/38bce0d509018dfbc28114d23ef54b1ee1369c97))
* gitlab接口返回取值 ([c1bd352](https://github.com/yanuoda/nidle/commit/c1bd352adbccd7808968be045382fdf718b90f17))
* merge Conflicts - 补全 CR 结果通知逻辑 ([4751d36](https://github.com/yanuoda/nidle/commit/4751d367e1b0a92660ecb95d8d4f4314ea4d3707))
* merge hook 问题修复 ([582be7b](https://github.com/yanuoda/nidle/commit/582be7bc9e8240bf1799cb321e8773eb92e17237))
* mysql time_zone ([eae7cf6](https://github.com/yanuoda/nidle/commit/eae7cf6b5f7f274ff1a0bc252ca6b84afc578436))
* project - 添加时补全git项目相关字段 ([b629f5e](https://github.com/yanuoda/nidle/commit/b629f5e6bd2cdea421046482b373de6099b6dbe1))
* projectServer字段返回missing ([aa81490](https://github.com/yanuoda/nidle/commit/aa814909021642cd346c84e18e585ac9b14b7852))
* projectServers server 关联id ([b6177f2](https://github.com/yanuoda/nidle/commit/b6177f2d5e3d5b7131efe22e976aed0751cebdde))
* queue concurrency 配置 ([bc347e1](https://github.com/yanuoda/nidle/commit/bc347e12e5ec789eb299863469b43428397daa4a))
* queue registerQueueAsync ([e32f19a](https://github.com/yanuoda/nidle/commit/e32f19a22b24d65879440464087d8c6b5c531de9))
* templateModule - add - missing return value ([f58f53d](https://github.com/yanuoda/nidle/commit/f58f53deb8a7362c821178bbb6af1a10c34344a7))


### Features

* 队列并发数配置 ([4a9c63c](https://github.com/yanuoda/nidle/commit/4a9c63c8454f01738dfb0f37adee4f0f160c648c))
* 通过id查询用户 ([e944365](https://github.com/yanuoda/nidle/commit/e944365df10a9eb33d62d91f53b72fe83a9fe144))
* 通知功能升级 ([4d7de0d](https://github.com/yanuoda/nidle/commit/4d7de0dab66a5fb99f186a764c89e5c883f9f2e9))
* change_v2 表；添加手工维护数据接口 ([0df3632](https://github.com/yanuoda/nidle/commit/0df36322fd2ff7df0c9d2bf559a25b69d0b3d141))
* changelog updateone ([5cf945d](https://github.com/yanuoda/nidle/commit/5cf945dbad5b07f741bc8c38a14db362f3815d58))
* job log changelog update ([36b3203](https://github.com/yanuoda/nidle/commit/36b32035c6c3c5421f4e410617fef6bc4b60b70c))
* queue 配置化 ([e6669ad](https://github.com/yanuoda/nidle/commit/e6669adf9f06cccbf4194df737f966870148b647))
* queue job percent update by stage ([a341ef1](https://github.com/yanuoda/nidle/commit/a341ef143a987b3d3816a4aeea93f14543f7c91e))


### Reverts

* 不限制查询字段 ([492b1bf](https://github.com/yanuoda/nidle/commit/492b1bf88a58356afa66d57a4f1f48f098291ca2))
* 改回commonjs ([9e80187](https://github.com/yanuoda/nidle/commit/9e80187c21473e5e6623cfcb694b42e64d4a95de))



# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
