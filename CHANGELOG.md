# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.2.5-alpha.0](https://github.com/yanuoda/nidle/compare/v0.2.4-alpha.0...v0.2.5-alpha.0) (2023-11-24)

**Note:** Version bump only for package nidle-monorepo





## [0.2.4-alpha.0](https://github.com/yanuoda/nidle/compare/v0.2.3-alpha.0...v0.2.4-alpha.0) (2023-11-24)


### Bug Fixes

* 发布配置函数运行错误捕获日志 ([911ed75](https://github.com/yanuoda/nidle/commit/911ed758102ba60ca263f8425399ed23d43ea662))
* 目录存在且分支一致，则复用目录，并执行git pull，保证后续npm install的复用 ([295b4ad](https://github.com/yanuoda/nidle/commit/295b4adec601a5f6970a10a5bb9e45e806a26a86))
* 删除发布-重命名文件时先判断文件是否存在 ([45a5a88](https://github.com/yanuoda/nidle/commit/45a5a881d6b7a106cd3c20c82c811f2e4ee94736))
* 生产环境的webhook发布不释放资源占用 ([1ed09d5](https://github.com/yanuoda/nidle/commit/1ed09d566e7be31a44c7488e3145a82d50100ce9))
* 手动确认发布交互优化 ([e340434](https://github.com/yanuoda/nidle/commit/e3404343bdec5615a5dc247d7119a182c6a1e496))
* 增加可复用源文件判断 ([1ceb850](https://github.com/yanuoda/nidle/commit/1ceb850fe2ff4ee9fd1f8dac7a3d5a284b41638d))
* 自动发布手动确认流程判断条件 ([dbce035](https://github.com/yanuoda/nidle/commit/dbce0359f413aa52f5ecd81967f4ed809eddf9d6))
* 子进程 progress 方法调用 ([8c23525](https://github.com/yanuoda/nidle/commit/8c23525cbe08f423d95c8fc2acb99815254a5b9b))
* 子进程progress error log ([ac7f760](https://github.com/yanuoda/nidle/commit/ac7f760e0628699317c1b54c59b963193c2c764d))
* antd props deprecated ([07f1b6d](https://github.com/yanuoda/nidle/commit/07f1b6d8422bd83a4d9b97b0a13b9856fb50e2b3))
* queue on stalled event ([a856736](https://github.com/yanuoda/nidle/commit/a85673682df5c4fa7be43f34b60bf352c591acf7))
* webhook 重新发布对应环境；发布记录字段文案调整 ([79f2f4b](https://github.com/yanuoda/nidle/commit/79f2f4b7e20bcdc3ff83e688c212e2176f464b4b))
* webhook响应失败时发送通知 ([6b7999e](https://github.com/yanuoda/nidle/commit/6b7999ed7e40aab8d9b629078f272cce619e98d7))


### Features

* 创建发布 - 分支查询优化 ([ee13156](https://github.com/yanuoda/nidle/commit/ee13156b5add5e55fdd1da23387c449906f28a57))
* 调整queue配置 maxStalledCount ([2b021f8](https://github.com/yanuoda/nidle/commit/2b021f826bcd8c3b6fbd18e980642e50a0f05706))
* 队列任务切换子进程 ([6b11583](https://github.com/yanuoda/nidle/commit/6b11583d69df775b5e42ea4edb221fab381576d1))
* 发布记录查询重构为分组分页查询 ([0fc34c7](https://github.com/yanuoda/nidle/commit/0fc34c7e4f4cdc601e73231449f327df760e7516))
* 获取队列运行信息、函数调用 ([c6060df](https://github.com/yanuoda/nidle/commit/c6060df5e1d077e324f15caf06505612461fb68a))
* 系统通知多tab下防止重复通知；点击事件跳转对应发布详情 ([c281aaf](https://github.com/yanuoda/nidle/commit/c281aaf582cd90aa8766b89e79b956396065ebaa))
* 自动发布流程手动确认功能 ([8200d82](https://github.com/yanuoda/nidle/commit/8200d827c32d6ffcbe1d264dcbd75634f905efa5))
* 自动发布流程暂缓MR时推送通知 ([913dc4d](https://github.com/yanuoda/nidle/commit/913dc4d3a0f83ea161026c36bef30e7a9112e1d9))
* 子进程任务参数配置化；队列 lockDuration调整 ([b8d962a](https://github.com/yanuoda/nidle/commit/b8d962aa322784276c0d2eea6afebc89b67c56c6))
* 子进程运行队列任务 ([59c2678](https://github.com/yanuoda/nidle/commit/59c26784d1954f64402e9802eab563437b68849e))
* callJobMethodBy update ([2895642](https://github.com/yanuoda/nidle/commit/2895642fd87e6d4366a4428bc1c1e6c52010b0a4))
* webhook发布插入手动确认流程 ([32644af](https://github.com/yanuoda/nidle/commit/32644afbc303ddf102e5bf3b235733da0d702a75))


### Reverts

* Revert "fix: merge" ([6907b12](https://github.com/yanuoda/nidle/commit/6907b12b2a3e33464aa6f071045b5871179da482))





## [0.2.3-alpha.0](https://github.com/yanuoda/nidle/compare/v0.2.2-alpha.0...v0.2.3-alpha.0) (2023-11-09)


### Bug Fixes

* 表字段length ([146b7d7](https://github.com/yanuoda/nidle/commit/146b7d78504ddbd1bde77f1ab0b11dd438d35165))
* 代码提交错误 ([04101ec](https://github.com/yanuoda/nidle/commit/04101ece874e695f5b65c48ce801f0b5e0a8adf4))
* 构建任务并发策略变更 ([b84b5ba](https://github.com/yanuoda/nidle/commit/b84b5bac0b9711f367435a7ef8f3328aa1beb0b0))
* 删除发布记录时的重命名文件判断 ([ddec9b9](https://github.com/yanuoda/nidle/commit/ddec9b90d2c6016fa09bebeed9d0f814311837a1))
* merge ([3fc45b9](https://github.com/yanuoda/nidle/commit/3fc45b9fdd72e54e7fd3cc58877dee2e578b7093))
* remove user folder ([5fcdb7e](https://github.com/yanuoda/nidle/commit/5fcdb7e54bdb6b2ce678646221d6315085c5e2f4))
* scp结束休眠等待scp完成；拦截gzip报错 ([dc363ca](https://github.com/yanuoda/nidle/commit/dc363ca6a7ae735b011522ee9c0c0f8210ba65a3))
* session user 判断 ([f5d509a](https://github.com/yanuoda/nidle/commit/f5d509ac1109e098a9614f44b5234daabb8b1c37))
* spa - 发布列表 - table横向滚动阈值 ([58fae58](https://github.com/yanuoda/nidle/commit/58fae588522d66e839721ddde49e7193b272e4da))
* spa-config.js ([e713716](https://github.com/yanuoda/nidle/commit/e7137169ca9923e55062a95fe366072f34872eb3))


### Features

* 发布记录删除功能（物理）；相关配置、日志文件重命名为'.bak' ([3b74104](https://github.com/yanuoda/nidle/commit/3b74104d288a23195aced725cbd02cc7314e3f1f))
* 发布详情-commiId展示、回到顶部 ([26ff185](https://github.com/yanuoda/nidle/commit/26ff18559afadfe48a22f8550b08aca2bb79966b))
* 构建任务完成时根据 stalled 手动变更 job 状态 ([c17f847](https://github.com/yanuoda/nidle/commit/c17f84728f4c5feae86c96cf2e4fb1594b5d06ee))
* 删除操作日志 ([5435f6d](https://github.com/yanuoda/nidle/commit/5435f6d6c94caf4daece28f6262a505edb4bf754))
* 刷新登录cookie过期时间；fix crypto 包引入错误 ([1dab358](https://github.com/yanuoda/nidle/commit/1dab358c8955a52caa39b57ce298b3be8ac4f1c6))
* 通知接收设置 ([a1977d0](https://github.com/yanuoda/nidle/commit/a1977d09cdd7baeac4c54bf55d20b69a7527799a))
* 通知信息增加发布id、描述 ([c5110de](https://github.com/yanuoda/nidle/commit/c5110defda411af9dc9dc16f9b7279b86c174fdf))
* job 操作及日志优化 ([8ec5dc6](https://github.com/yanuoda/nidle/commit/8ec5dc6f254bf7072695c01c8f6ff367dc656c73))
* queue on global:stalled ([42baf82](https://github.com/yanuoda/nidle/commit/42baf8236d28cf3537d4df892afb417e363bf21a))
* spa - 首页增加快捷入口 ([77f6602](https://github.com/yanuoda/nidle/commit/77f6602a047f64cad46ce05fbc784cdca6fc460f))
* spa-模板删除功能 ([c790b9a](https://github.com/yanuoda/nidle/commit/c790b9a5b28346784ffa2f9d0579a29cf094ec13))





## [0.2.1-alpha.0](https://github.com/yanuoda/nidle/compare/v0.2.0-alpha.0...v0.2.1-alpha.0) (2023-08-10)


### Bug Fixes

* remove locker ([4bf2df5](https://github.com/yanuoda/nidle/commit/4bf2df5926331a40ff343b265cee543f8fd5248a))


### Reverts

* 改回@okbeng03/p-queue ([397cd28](https://github.com/yanuoda/nidle/commit/397cd289fbf179ff1963624f277d4203f692a68f))
* 改回@okbeng03/p-queue ([ed54b1b](https://github.com/yanuoda/nidle/commit/ed54b1bd9ca6a4543fe93ecd01b248b082822440))
* 支持refactor/nestjs publish ([de7f7a3](https://github.com/yanuoda/nidle/commit/de7f7a347b955f2e7643a3cd3db5b6f6bca6f6b1))





# [0.2.0-alpha.0](https://github.com/yanuoda/nidle/compare/v0.1.8...v0.2.0-alpha.0) (2023-08-10)


### Bug Fixes

* 本地环境调试问题修复 ([f29252a](https://github.com/yanuoda/nidle/commit/f29252a742e6c6670c5f3ab6e259e8c391d79565))
* 本地运行调试错误修复 ([767d7b8](https://github.com/yanuoda/nidle/commit/767d7b8f54e7ea47daa20edc1ad80291a10c6c8d))
* 本地运行调试问题修复 ([454f848](https://github.com/yanuoda/nidle/commit/454f848c2993bf8d313dfb34ed8793589dfb1c48))
* 发布生产备份 ([58e8eea](https://github.com/yanuoda/nidle/commit/58e8eeac088acc2d1896cfd4b167bc6d573f6962))
* 非生产环境非覆盖式发布 ([5720ce1](https://github.com/yanuoda/nidle/commit/5720ce137efc048f3a68f1f4827852b237649990))
* 分页查询参数有效判断；where对象组装判断 ([70adebf](https://github.com/yanuoda/nidle/commit/70adebf9da3f070225638f720ce7bc4740199604))
* 服务器适配 ([e878011](https://github.com/yanuoda/nidle/commit/e878011fde2dad626cefc28ba30d7a9d916c7caf))
* 开始刷新页面保证inputs初始化 ([e117c1e](https://github.com/yanuoda/nidle/commit/e117c1e6c966fe8f046f70a9f5ae89d43e246fcd))
* 配置信息参数新增判断是否是新建发布 ([cd98a04](https://github.com/yanuoda/nidle/commit/cd98a0443215f0e15e6e7fe2f30c0a394fa90c6e))
* 去掉文件拷贝步骤不必要的入参 ([6d6351f](https://github.com/yanuoda/nidle/commit/6d6351fbf6f1beefcc280fb773ce9aca928d83fe))
* 权限不够异常处理 ([599cea3](https://github.com/yanuoda/nidle/commit/599cea3b511b39056352ea0959445448836418f1))
* 权限不够异常处理 ([b71825c](https://github.com/yanuoda/nidle/commit/b71825c4f837c810dfca20c9a9e935c4d381ae03))
* 删除不必要参数字段 ([c878b17](https://github.com/yanuoda/nidle/commit/c878b179919e9a77759f3c0a8ab8e88994ca24c5))
* 使用 Array.some 方法时未返回值 ([1ef64a3](https://github.com/yanuoda/nidle/commit/1ef64a3de2a326d36d7c68c4b2d81c509ad3f04e))
* 体验优化：新建发布记录成功提示后才刷新页面 ([2ff6417](https://github.com/yanuoda/nidle/commit/2ff6417b948f7e8f97a18df580474fa675c95985))
* 退出发布清除缓存 ([c3af57e](https://github.com/yanuoda/nidle/commit/c3af57ecf5ef93f3af15a7304f6ba0f232e82840))
* 退出发布设为禁用无法重新发布问题修复 ([16746df](https://github.com/yanuoda/nidle/commit/16746df14344aaefaba726678211c704a8ae8350))
* 新建发布commitid ([0260b03](https://github.com/yanuoda/nidle/commit/0260b032e888bb3d64245b95bcb602d79defea10))
* 修复 nidle-web 服务 IP 和端口配置不生效的问题 ([35a4c36](https://github.com/yanuoda/nidle/commit/35a4c36b2495ffd118f0b8d83fed90a88f5a54a5))
* 修复安装 nidle 流前置步骤错误 ([e5ee1ce](https://github.com/yanuoda/nidle/commit/e5ee1ced4f04b5293d4dcb5f91ed7a7ba0ce0a53))
* 修复更新时获取已安装版本不正确的问题 ([07b5114](https://github.com/yanuoda/nidle/commit/07b5114dd3d90a67fc53a04a9b981e9051959cf0))
* 修复依赖 diff 时报错且未输出错误信息的问题 ([874be23](https://github.com/yanuoda/nidle/commit/874be2317cc51d538b014c0be6def903a270a040))
* 修复依赖 diff 问题及代码优化 ([e443a98](https://github.com/yanuoda/nidle/commit/e443a98f5ae07a2e7bc82efa91a5f56460a30af6))
* 修复应用查询时空字段导致无查询结果的问题 ([c4b0e98](https://github.com/yanuoda/nidle/commit/c4b0e98bde85cc3616d98ab0fd0a285f244b2cf2))
* 一键安装 setup 命令未指定版本时默认安装最新版 ([b3f5fcc](https://github.com/yanuoda/nidle/commit/b3f5fcc8dd3a75110a995c20c5024794ba58a803))
* 一键更新时对 nidle-spa 的 dev 依赖项也要做 diff ([e03dc95](https://github.com/yanuoda/nidle/commit/e03dc9579e54d61402050d911aa6e2951afc7b2b))
* 应用名称校验 ([40c48e3](https://github.com/yanuoda/nidle/commit/40c48e352f292a5239bd0128c22009b0a82a3155))
* 只返回20条分支；放开限制到100条；如果以后还超出这个限制，需做分页处理 ([dd33a3d](https://github.com/yanuoda/nidle/commit/dd33a3d27d47cdfe518b47890cb7430604e1ad54))
* 重新发布保留类型 ([27fd4f3](https://github.com/yanuoda/nidle/commit/27fd4f3096995be52fc703e41d17c5769204aa49))
* asyncWait util bug; queue reject error set ([84136bd](https://github.com/yanuoda/nidle/commit/84136bdd7aa1916d470e92d16a359e39e2bbd516))
* circular dependency ([776404d](https://github.com/yanuoda/nidle/commit/776404d634305b790a0d6b1fd13494f5a6322a4b))
* cp 命令添加 -f 选项 ([1bca602](https://github.com/yanuoda/nidle/commit/1bca6028339ba0bc726e27b9627c3392335fe8d4))
* environment enum ([1f545c0](https://github.com/yanuoda/nidle/commit/1f545c0f66df702f1438aef1e098f8f93dd92d05))
* eslint warnning日志处理错误，导致插件运行失败结束 ([1f2b8c5](https://github.com/yanuoda/nidle/commit/1f2b8c5f5cafae01ec266ac7c32d38895d37e550))
* eslint报错过滤 ([f9ded8e](https://github.com/yanuoda/nidle/commit/f9ded8e3dad030d28c4a0dcb32d1d5593b1fe28f))
* github关联跳转 ([d8cc01e](https://github.com/yanuoda/nidle/commit/d8cc01e8b3502eb8f1ba7caba68a8c1c799a117f))
* gitlab授权链接 ([2b8e3bf](https://github.com/yanuoda/nidle/commit/2b8e3bfbd5702547d645deeeb677ff42b862f7ba))
* ignore /api router ([d7c6dd2](https://github.com/yanuoda/nidle/commit/d7c6dd2dd66005d2f1eb4a84069795199a27117a))
* merge request close 不触发 webhook自动化发布 ([6cc76b9](https://github.com/yanuoda/nidle/commit/6cc76b974663912727f5a2e6e36d1251bc3c0c11))
* merge已存在不报错处理 ([0f98201](https://github.com/yanuoda/nidle/commit/0f9820118b08df702be45d6b451bc52fb0188414))
* next type ([dcd9eaf](https://github.com/yanuoda/nidle/commit/dcd9eaf250ca6f37692574074e49ccb80c4894bd))
* nidle-cli 对比依赖遗漏了新版新增依赖的情况 ([3edd85a](https://github.com/yanuoda/nidle/commit/3edd85a4e9904db70fc0bda9cad73f6f1ff3ea72))
* nidle-cli 更新版本时，先对依赖进行 merge 再 diff ([17a3a11](https://github.com/yanuoda/nidle/commit/17a3a115c65df78090d450f8b7f9cbe678ad3ef7))
* no lint & browserlist error 处理 ([656114d](https://github.com/yanuoda/nidle/commit/656114d30b086e295dc45da87d50a7ef8b20ab5d))
* pm2 初次启动 stop 报错不影响服务启动 ([f96578b](https://github.com/yanuoda/nidle/commit/f96578b085a6047643fdadd5fb492f501a51a893))
* pm2 初次启动 stop 报错不影响服务启动 ([c4a950e](https://github.com/yanuoda/nidle/commit/c4a950e820d9b871ec3b46b7da1364be1a8fa92f))
* redis config ([ef58eca](https://github.com/yanuoda/nidle/commit/ef58eca1a101d1d527baf557add1e48d4c86c7e0))
* redis host; publish list children set ([e78c98a](https://github.com/yanuoda/nidle/commit/e78c98a2f4b631ede8196f80423c4b7f41e3db84))
* router 伪装图片兜底处理 ([e17fa91](https://github.com/yanuoda/nidle/commit/e17fa91aef51b1d0d8af9091d9aad0492f700bbe))
* server表时间格式 ([a2abeab](https://github.com/yanuoda/nidle/commit/a2abeabe39817b479e2a2256567a851f33e093d2))
* shell 脚本被killed报错并退出 ([12c2fd7](https://github.com/yanuoda/nidle/commit/12c2fd7da422d97f5b314fb23b947af54cc2cb31))
* template status默认值设置 ([1f2fdae](https://github.com/yanuoda/nidle/commit/1f2fdae1ff37819a96535b4d41095a583d4a0e75))
* user module swagger info ([c48c61b](https://github.com/yanuoda/nidle/commit/c48c61b854f6730fcb4da77f53438b28fbe91826))
* webhook request newest commit id ([a3061bf](https://github.com/yanuoda/nidle/commit/a3061bf0697ee2978f3cf90aef4bd42b1282e6d5))
* webhook判断 ([f761a7a](https://github.com/yanuoda/nidle/commit/f761a7aa41e73abc08c2d29b50ff9944f3bf82e4))


### Features

*  github support ([ac9cfa3](https://github.com/yanuoda/nidle/commit/ac9cfa38abb255d02e1dd610c0c49a4217c0914e))
* 服务器模块CRUD ([e0a5fb0](https://github.com/yanuoda/nidle/commit/e0a5fb0053ae192ebeec0ce312e9cf4f0ec00cef))
* 更新命令对 nidle-web 配置项做差异化问询 ([fbdb437](https://github.com/yanuoda/nidle/commit/fbdb437d9126295b4c36c2dc09f86f03b379d958))
* 数据库链接配置 ([33a974d](https://github.com/yanuoda/nidle/commit/33a974d87ccb2bcc60ba308058c29ede5aa8d025))
* 添加 BullBoard 插件；修改接口前缀注册 ([b93dcc9](https://github.com/yanuoda/nidle/commit/b93dcc9c5dfc2d3fcd17067beba1d8d3c22e1a7f))
* 添加 nidle-cli 安装及更新详细信息选项 --showinfo ([b0a1f40](https://github.com/yanuoda/nidle/commit/b0a1f400ce0cc80d31b05c9b8e191385fb30aa6d))
* 添加服务启动成功提示信息及安装命令添加指定版本 flag ([7185212](https://github.com/yanuoda/nidle/commit/7185212898a23ce9539f09c0ab1f07685ca38159))
* 添加数据库服务端口配置项 ([a24d8fe](https://github.com/yanuoda/nidle/commit/a24d8fe6e3ff9efa49e3abe07f9d8b263f6f5dbd))
* 完成 setup 命令断点续装功能 ([b94b998](https://github.com/yanuoda/nidle/commit/b94b998dcfd696bf468d25047d2c93e5f177aa6c))
* 完成 update 命令断点续装功能 ([ed24bc8](https://github.com/yanuoda/nidle/commit/ed24bc8b05fd0afa353c510599b8bfd2d6ab0432))
* 增加 host 配置 ([0f998cc](https://github.com/yanuoda/nidle/commit/0f998cce85d1275c95963543e1092d8818f77b6d))
* 增加interceptor和filter统一处理response格式及错误捕获返回格式 ([a0e0eb6](https://github.com/yanuoda/nidle/commit/a0e0eb60935292efb0ad2162b70fa27f7a1e5d19))
* 账号关联 ([8093a4d](https://github.com/yanuoda/nidle/commit/8093a4d3f93029fff9e48db3f2207880c23941ab))
* 账号关联及应用权限判断 ([1b0ce56](https://github.com/yanuoda/nidle/commit/1b0ce5600c0ea8d9cac5dcdfb371b45698fd20b5))
* add column publish type ([803d56f](https://github.com/yanuoda/nidle/commit/803d56fbed688cd256cbcec21bc00257ea5034cb))
* auto validation pipe ([5daa47b](https://github.com/yanuoda/nidle/commit/5daa47b666ec1eb0efd6f02b2a4e65a0da0ee9e0))
* changelog features ([40abeb4](https://github.com/yanuoda/nidle/commit/40abeb4c310ea5116e939e49fe3551879db364bb))
* changelog、config module feature ([b975f69](https://github.com/yanuoda/nidle/commit/b975f69020087554f09076a12937b66c036643ab))
* github merge request ([9eab73f](https://github.com/yanuoda/nidle/commit/9eab73f4df767980e3c872984390bd8a240091d6))
* history api fallback ([d094f33](https://github.com/yanuoda/nidle/commit/d094f332befd9b83b65db144346bf72300432072))
* lib module - gitlab service ([c38b435](https://github.com/yanuoda/nidle/commit/c38b4357cdf22d953bd85a0491a3bf44b155cd67))
* nidle 一键部署 ([dff8337](https://github.com/yanuoda/nidle/commit/dff8337a34ad17e7235bf36294acc38729084dec))
* nidle-cli 日志输出优化 ([17bdcba](https://github.com/yanuoda/nidle/commit/17bdcba9881ee3be7c19a7bc01990de448aaf35a))
* nidle-web 添加对 nidle-cli 的依赖版本范围功能 ([6b7e10c](https://github.com/yanuoda/nidle/commit/6b7e10c5e6d369fd07ddce63882a4fae9d523ced))
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
* webhook publish ([e2132fc](https://github.com/yanuoda/nidle/commit/e2132fcd4c7e63e6abe451660a40d9d882c2d198))
* webhook publish success 停留在当前发布环境，可以退出 ([c755a5e](https://github.com/yanuoda/nidle/commit/c755a5ec6499a98fc8da6d8055859b5e1c351954))
* webhook支持多记录同时运行 ([781b0f9](https://github.com/yanuoda/nidle/commit/781b0f9f39e6e411119a0db268d72a9705b1d068))
* winston logger ([8599e14](https://github.com/yanuoda/nidle/commit/8599e14cca33690505659a71594654bf20be860f))
* winston logs output ([fb68ec2](https://github.com/yanuoda/nidle/commit/fb68ec2eb0a65da95ec2fa0be5174c99e41b7509))
* wip-server 模块 ([a4e9b93](https://github.com/yanuoda/nidle/commit/a4e9b93e1efc8daaf281950254cbf2c8e4c2b7c4))


### Reverts

* 还原调试代码 ([cc49063](https://github.com/yanuoda/nidle/commit/cc4906345efe02b7e5ca5206ec56064e2e108390))





## [0.1.8](https://github.com/yanuoda/nidle/compare/v0.1.7...v0.1.8) (2022-03-02)


### Bug Fixes

* 插件没执行完时日志截取不完整问题修复 ([8a52e70](https://github.com/yanuoda/nidle/commit/8a52e70557913f08a2f4850f2f623a8abd5512b5))
* 发布生产成功后释放机器 ([c88943d](https://github.com/yanuoda/nidle/commit/c88943d82e1e9de3c16e07561a52d8137e496135))
* 非覆盖式解压 ([dc9354b](https://github.com/yanuoda/nidle/commit/dc9354b405ef3a90d82e5351b93d4c9a61444ed8))


### Features

* 增加结束后延迟关闭后台进程，保证日志输出完整性 ([10bcd70](https://github.com/yanuoda/nidle/commit/10bcd704ef6aefb39711d9369f142eb74d4abfb5))


### Reverts

* 非覆盖式解压 ([8155e3a](https://github.com/yanuoda/nidle/commit/8155e3ab81e9c5bd6529a13502ab43ca553ac67f))
* 延迟结束放在应用层 ([8795fb5](https://github.com/yanuoda/nidle/commit/8795fb5d2ae6797566b8cc3d401e35123243f2bd))



## [0.1.7](https://github.com/yanuoda/nidle/compare/v0.1.6...v0.1.7) (2022-03-01)


### Bug Fixes

* 添加服务器不需要验证判断 ([67256c1](https://github.com/yanuoda/nidle/commit/67256c11c586d12a6d0e798134af4c00440961bb))
* 延迟推送消息保证日志输出完整 ([f6a59a1](https://github.com/yanuoda/nidle/commit/f6a59a13ad78ebc7bd3fe3972136b6e0cc617a23))



## [0.1.6](https://github.com/yanuoda/nidle/compare/v0.1.5...v0.1.6) (2022-03-01)


### Bug Fixes

* 修复项目设置页修改服务器信息报错 ([c1146fe](https://github.com/yanuoda/nidle/commit/c1146fe8e8cd4673b7c41d16bd09ba485a4037b7))


### Features

* 列表中所有发布记录都添加发布详情链接 ([360c09f](https://github.com/yanuoda/nidle/commit/360c09fb4d27537f486a4479a87613f590dac359))



## [0.1.5](https://github.com/yanuoda/nidle/compare/v0.1.4...v0.1.5) (2022-03-01)



## [0.1.4](https://github.com/yanuoda/nidle/compare/v0.1.3...v0.1.4) (2022-02-18)


### Bug Fixes

* 日志格式化问题 ([ba0c2c1](https://github.com/yanuoda/nidle/commit/ba0c2c13321a94615ed87fbec217aaf87f7d1c54))
* 应用配置没有执行chain ([afd511b](https://github.com/yanuoda/nidle/commit/afd511ba678c3e08259880c88cee14f3d60a2d15))
* 重新发布commitId错误 ([d8287f0](https://github.com/yanuoda/nidle/commit/d8287f0af435b2ced74a002d6037af74ccd26b1c))
* dataType=text message undefined ([346b275](https://github.com/yanuoda/nidle/commit/346b2756b5b38323d391d5602dfab816654b4f55))
* imagemin固定版本，最新版本esmodule有问题 ([6eb176a](https://github.com/yanuoda/nidle/commit/6eb176a7f522d09b3ad8ac561ab76c7227058633))
* input type ([1420083](https://github.com/yanuoda/nidle/commit/142008392757561beb294ded533d2c57b3e7d9a3))


### Features

* 发布记录状态展示环境信息 ([da0d977](https://github.com/yanuoda/nidle/commit/da0d977b79bbd901ac34a6d82d40807715e90104))



## [0.1.3](https://github.com/yanuoda/nidle/compare/v0.1.2...v0.1.3) (2022-02-10)


### Bug Fixes

* chain function must require from js file ([3e17725](https://github.com/yanuoda/nidle/commit/3e17725fdb845b131cc5bf6c654b1139b7bffb35))
* changelog projectName ([8f06576](https://github.com/yanuoda/nidle/commit/8f0657634a2dc87f720f8a6b14cd22df54f57c3e))
* dataType ([a9cfc18](https://github.com/yanuoda/nidle/commit/a9cfc18790bec0e14ed23cf4cb8debd1d3e9c30e))
* default value ([e0ba268](https://github.com/yanuoda/nidle/commit/e0ba2683ca51f8488799a7258f0fcf4ef4f6809b))
* linux 新命令识别不一致 ([56b6b61](https://github.com/yanuoda/nidle/commit/56b6b61ff98466d5aaf5f753256783d2a7b7c9c6))
* output merge ([20a4c11](https://github.com/yanuoda/nidle/commit/20a4c11c34c044eea0149dbdf6a8650d14d7e870))
* steps undefined ([9e0db09](https://github.com/yanuoda/nidle/commit/9e0db094c1eac614785920bd446d826b846f2b53))



## [0.1.2](https://github.com/yanuoda/nidle/compare/v0.1.1...v0.1.2) (2022-02-08)


### Bug Fixes

* child process error ([a3886c5](https://github.com/yanuoda/nidle/commit/a3886c524a9de74deab93e9e2293aff7e3bb7a00))
* git repository & error capture ([c0bf3a6](https://github.com/yanuoda/nidle/commit/c0bf3a649ff5410185158364e0d57430a9f3a211))
* tar auth ([27f2435](https://github.com/yanuoda/nidle/commit/27f2435545174bec63f0d5cb3bf391f8fbc3c2ad))


### Features

* 修改密码页 ([d19e4af](https://github.com/yanuoda/nidle/commit/d19e4afebacbbf1a72c2989cf1abcc33b53065fc))
* mailer ([f92ad20](https://github.com/yanuoda/nidle/commit/f92ad20d30f9c8b967f54bf56e43e15d69543b76))



## [0.1.1](https://github.com/yanuoda/nidle/compare/9425e8a4bf86a6ba708d0541780dacf5ed087e28...v0.1.1) (2022-01-26)


### Bug Fixes

* --production配置化 ([73394a1](https://github.com/yanuoda/nidle/commit/73394a181bd8f2e153433679f1e21af7ef82b533))
* --production配置化 ([22da13f](https://github.com/yanuoda/nidle/commit/22da13f1d9b0ad835763c970af9c5bc97a0b9b95))
* --production配置化 ([688682f](https://github.com/yanuoda/nidle/commit/688682f0b9cd35bd9ec8fb5c4a9bf5ac39cbc9a6))
* 保存应用信息后返回应用名不正确 ([0fc90e1](https://github.com/yanuoda/nidle/commit/0fc90e17080faf233e2070bec1cb984449e9ffd2))
* 避免highlight注册多次 ([9b71498](https://github.com/yanuoda/nidle/commit/9b71498780e86ef00edf287eac92062a6bc160b3))
* 不解压保存服务文件 ([b2428d2](https://github.com/yanuoda/nidle/commit/b2428d2bfc7ae842c8058cde1a29ae85b75b599a))
* 错误后结束任务 ([75c7236](https://github.com/yanuoda/nidle/commit/75c7236868f0abff562883ba2ac1cd87f8003063))
* 错误时不触发completed事件 ([4fece3e](https://github.com/yanuoda/nidle/commit/4fece3e70211d11dff2d3c8572a035b8b086298a))
* 错误信息没有正确记录 ([d87a58d](https://github.com/yanuoda/nidle/commit/d87a58d2d299c4127059ea2855dd719f4e73dc8f))
* 发布记录列表链接拼接错误 ([fc7033a](https://github.com/yanuoda/nidle/commit/fc7033a255c5a64170b2aca43ae7a060a7a502f6))
* 发布失败input ([a4cc3e9](https://github.com/yanuoda/nidle/commit/a4cc3e9baeed41dbdbdce62ad3e6fc0a1b10e947))
* 刚创建就取消发布状态、日志问题修复 ([0f5cc44](https://github.com/yanuoda/nidle/commit/0f5cc440bc0c1f917c717485f8a58022c00ab593))
* 获取发布环境赋值问题 ([8d9ae08](https://github.com/yanuoda/nidle/commit/8d9ae08bbd82d8864c24c431c7921f997c18ef82))
* 获取配置模板 ([db1b297](https://github.com/yanuoda/nidle/commit/db1b2972bbaade6ed8272902a9f32dd7e89324e0))
* 结束后将duration写入表 ([71e31d4](https://github.com/yanuoda/nidle/commit/71e31d4056414c9399fd25b8f02787b4599567b8))
* 局部缓存retry/timeout字段，解决丢失问题 ([230d400](https://github.com/yanuoda/nidle/commit/230d4003ec85e8425fff513235078d9a03dbf998))
* 取消 sequelize 查询结果返回原始结果 ([e213dd0](https://github.com/yanuoda/nidle/commit/e213dd0fb0c19257c19bf96e8cd52d4e3c004cb1))
* 失败也是重新创建记录 ([b75c638](https://github.com/yanuoda/nidle/commit/b75c638656f213748f42cad3e4acc1f533ef0c59))
* 通过gitlabid获取配置 ([a0c1d8a](https://github.com/yanuoda/nidle/commit/a0c1d8a8746604688f3ca70909530944bcac50d4))
* 新命令结束标识 ([7f34e4a](https://github.com/yanuoda/nidle/commit/7f34e4a91d53d832b3bdd38cea60319492b17a3f))
* 修复新建应用时应用名称获取不准确及报错的问题 ([a82e495](https://github.com/yanuoda/nidle/commit/a82e495ebb4b5be0d02b4ab157083990a34d8b6d))
* 修复一些发布的问题 ([0bf8ef8](https://github.com/yanuoda/nidle/commit/0bf8ef8b15bfd7c8e2bbac7eaf1c8506356c74ab))
* 修复eslint校验提示 ([9425e8a](https://github.com/yanuoda/nidle/commit/9425e8a4bf86a6ba708d0541780dacf5ed087e28))
* 修改 project_member 的 role 字段类型 ([9614e41](https://github.com/yanuoda/nidle/commit/9614e417fac01a57d86eec3c4c4b8274c90b0474))
* 修正部分变量命名和文案细节 ([a41493c](https://github.com/yanuoda/nidle/commit/a41493c1a975d39cb7f794dd18ec767d30c1461d))
* 需要主动init，因为要返回inputs ([dc98984](https://github.com/yanuoda/nidle/commit/dc98984254aaf7549fec1798fd7dfec29c67670d))
* 应用列表跳转详情时漏了展示应用名称 ([9033b21](https://github.com/yanuoda/nidle/commit/9033b2100311353d7e3bbfaecc06c295e3582719))
* 重新开始时readonly状态切换问题修复 ([29a1a61](https://github.com/yanuoda/nidle/commit/29a1a617f70434508f7a55ac63355f838850f40f))
* add id & update data ([5e1bd49](https://github.com/yanuoda/nidle/commit/5e1bd4966820be99fae3c393457fc0d87e500a89))
* cache缓存容易混淆，所以备份直接从构建备份 ([f26f113](https://github.com/yanuoda/nidle/commit/f26f113ae7a7c112a57534c281fee32de3c7ae49))
* codeReview跳转 ([e625c05](https://github.com/yanuoda/nidle/commit/e625c05ad140af683d4a38757512d638c9bbe72e))
* codeReview跳转 ([2687a94](https://github.com/yanuoda/nidle/commit/2687a94d0dde3d091690e5a35750f5e9e714153d))
* config option ([2ad4454](https://github.com/yanuoda/nidle/commit/2ad445421445d66ef497d03fc2ff9dfa4639d0ac))
* **db:** 修改数据库字段类型 ([02a09f6](https://github.com/yanuoda/nidle/commit/02a09f655cbf0ccae71636d288dee5685c262dde))
* disabled状态错误 ([95a3d43](https://github.com/yanuoda/nidle/commit/95a3d43ea5a34544dc90180760ec508120b9e209))
* duration校准，保证一直更新 ([039e75e](https://github.com/yanuoda/nidle/commit/039e75e17217dc57201316b99ed16d9cc9c45367))
* error错误输出 ([2d0ec64](https://github.com/yanuoda/nidle/commit/2d0ec6450d83065ee98458b7098d4d8e38d9f961))
* extend options ([dde15cb](https://github.com/yanuoda/nidle/commit/dde15cbdc4b0d58d723ceee6478e216bcb0f253e))
* gitlab请求reponse调整 ([8087264](https://github.com/yanuoda/nidle/commit/8087264333daba1482f964607711d17ce02a5e76))
* input ([d57cc79](https://github.com/yanuoda/nidle/commit/d57cc79a7bf9fcb08b1ade7837927d16643bd139))
* input ([d23902b](https://github.com/yanuoda/nidle/commit/d23902bf6daa7c2770ef3504f0cad7f31cbfcc5b))
* input ([21750d0](https://github.com/yanuoda/nidle/commit/21750d0c3b76e9c49db4b2d8e6753a59ec185e65))
* input & input(options) ([7f5d441](https://github.com/yanuoda/nidle/commit/7f5d4414bf1558ed6556a3a73ee38a88434d19a7))
* input 增加step后combine判断修改 ([795c691](https://github.com/yanuoda/nidle/commit/795c6912094d2b111c78e7433febb94e938ee6c5))
* input是跟插件绑定的，应该用插件路径当key做缓存 ([c6fefba](https://github.com/yanuoda/nidle/commit/c6fefba8b1d853b10b9facbcc12abab57514bbfa))
* jest跑不起来问题 ([633a743](https://github.com/yanuoda/nidle/commit/633a743c92e9cae9e7b2a3eaefd09c7fa00c2d6a))
* log -r换行问题 ([7ed901f](https://github.com/yanuoda/nidle/commit/7ed901f6949c4837bce90ca79631dc2cf5a4e52f))
* log文件路径由配置提供 ([48dd830](https://github.com/yanuoda/nidle/commit/48dd83032b0aa1c2fb1b9bf39aee5a121d665702))
* log文件路径由配置提供 ([14b2415](https://github.com/yanuoda/nidle/commit/14b2415eaf3b3041c01c63a9dbd6f7e5c87a512a))
* merge confict ([c60c5ca](https://github.com/yanuoda/nidle/commit/c60c5ca63f110c4929fbcfe466ddebaf907af333))
* raw = false取值问题 ([2b4563e](https://github.com/yanuoda/nidle/commit/2b4563e0519a29f1f5892f643b6b127b6a5649c2))
* raw=true 取值问题 ([97ff0bf](https://github.com/yanuoda/nidle/commit/97ff0bfab909d7d05edfc3bcc2971ef80c78e45e))
* readonly判断有误 ([14172d3](https://github.com/yanuoda/nidle/commit/14172d39d653876e12eae65ddfe0fcbb865c74c2))
* replace ([00f0a03](https://github.com/yanuoda/nidle/commit/00f0a030a9f07ca47253805453a9783770d0f34e))
* required ([26b83f8](https://github.com/yanuoda/nidle/commit/26b83f835c5429461755bfa3c6a2dcb4f2afcda0))
* source 路径唯一 ([86386d8](https://github.com/yanuoda/nidle/commit/86386d893bce94d06791aabea3ba2918a44e8020))
* status default value ([fdd7c13](https://github.com/yanuoda/nidle/commit/fdd7c136720837aa93ee603adcfc3efbff2cdc45))
* tar 解压会出现无用日志并且会冲掉原有日志，所以过滤掉 ([af7d1b3](https://github.com/yanuoda/nidle/commit/af7d1b38442e482368034a8e0b65cd2146f0220b))
* task实例引用错误 ([661ef85](https://github.com/yanuoda/nidle/commit/661ef8515685513d0681181d0a7aa2d018a4cdb4))
* try catch throw error ([24c6900](https://github.com/yanuoda/nidle/commit/24c6900bfec41102398ca94a5f1b7d3ef32e172e))
* update函数通过挂载绑定 ([b8407b6](https://github.com/yanuoda/nidle/commit/b8407b638120fe5d67bba60f564ffc107f6bd243))
* value ([3598e87](https://github.com/yanuoda/nidle/commit/3598e8750796eef784629360e711fed666c2928e))
* value ip ([c39c247](https://github.com/yanuoda/nidle/commit/c39c247ebf81dcbd8450367742e096dae2377fd2))


### Features

* 备份功能 ([66bd36a](https://github.com/yanuoda/nidle/commit/66bd36a745c4daf2889916bbe3586010a69d8350))
* 操作部分检查用户是否有权限 ([c623474](https://github.com/yanuoda/nidle/commit/c623474f416c7cad66cc1cb5b1550c2d0e256638))
* 插件挂载调度基础 ([1988a46](https://github.com/yanuoda/nidle/commit/1988a46cf64a515c5aa98411f322582d1ed3fc29))
* 当不解压时把服务器信息挂载在task上以便复用 ([e4e46f1](https://github.com/yanuoda/nidle/commit/e4e46f1cdae7ba47e1a93d0281b20196f5d6dad5))
* 调度器类 ([8ba6f1f](https://github.com/yanuoda/nidle/commit/8ba6f1f65118b1d69785b6aac327522b9714e94f))
* 发布列表到发布联调 ([6650394](https://github.com/yanuoda/nidle/commit/665039443993ecd41e8bfd1b155f2290d39a3128))
* 发布列表页 ([640cc37](https://github.com/yanuoda/nidle/commit/640cc378589a4493eaf71a32d490ad1de5a76a75))
* 发布列表页-前端页面 ([5754b99](https://github.com/yanuoda/nidle/commit/5754b993100e2f037f32ef647c44a9083eab719a))
* 分支选择时添加提交者展示 ([dd2cf89](https://github.com/yanuoda/nidle/commit/dd2cf89491e4cfa90138b539dd90ee8e1036759d))
* 服务器接口 ([f066b1b](https://github.com/yanuoda/nidle/commit/f066b1bc45d48fcd13b952bc6f4b6ffc463d6af8))
* 给安全的插件传入私密配置 ([859a5ed](https://github.com/yanuoda/nidle/commit/859a5ed564ac1a157a28950db75adaf75f2eb864))
* 获取 gitlab 应用成员并展示 ([2f11de2](https://github.com/yanuoda/nidle/commit/2f11de2da56b2c833a70114cdd3f119a0d302c11))
* 获取应用 owner 和设置默认仓库类型字段 ([5845faf](https://github.com/yanuoda/nidle/commit/5845fafec117848f2deb47f2af9e8b5cda8f3a6c))
* 基础插件 ([0883990](https://github.com/yanuoda/nidle/commit/08839905f27ca7c2795e102ef580a18fe19fbc34))
* 配置读取相关（暂时mock数据） ([507fec4](https://github.com/yanuoda/nidle/commit/507fec46f24c5ec3354c67a54899347d5b9be1d3))
* 配置模板模块 ([60b42ba](https://github.com/yanuoda/nidle/commit/60b42ba1e47ec92759604a0f5d14e2399ffce190))
* 配置项处理及单测 ([5d8fd2c](https://github.com/yanuoda/nidle/commit/5d8fd2cce1bd2a0ef407b2f816237b3f54810174))
* 日志模块 ([b49fb1b](https://github.com/yanuoda/nidle/commit/b49fb1b608cf42611a9976acdb9b6d5484aef5fe))
* 添加发布脚本 ([229e3fe](https://github.com/yanuoda/nidle/commit/229e3fec61a202d687648a374cf302a8937b18a1))
* 添加服务器查询接口 ([817ecb9](https://github.com/yanuoda/nidle/commit/817ecb944b1a4abc41c794bcb81aad45e12bb73e))
* 添加模板时设置默认启用 ([0452a90](https://github.com/yanuoda/nidle/commit/0452a900209d5a1dc9563fdb3de2fb89532f9b5c))
* 退出发布 ([896eeee](https://github.com/yanuoda/nidle/commit/896eeee0d3439ae02f6603f0369bcd40e49e838f))
* 完成服务器管理模块初版，包括列表展示和查询，表单新增和编辑。待测试后合并 ([77bea52](https://github.com/yanuoda/nidle/commit/77bea52be418424566dde11b866d18ea505cc170))
* 压缩、拷贝目标目录不存在时创建目录 ([0b52b62](https://github.com/yanuoda/nidle/commit/0b52b62aed4c51f09c2dec7d091c477f27b57d18))
* 压缩包统一文件名 .tar.gz ([e0aef38](https://github.com/yanuoda/nidle/commit/e0aef38e4538176be991e3501c914d6d108def7d))
* 移除进度无用日志，否则日志太长 ([a0336b6](https://github.com/yanuoda/nidle/commit/a0336b67aea1f1592c407391f54b715ae800ae21))
* 应用列表和新建、编辑应用信息页面及接口 ([879afc2](https://github.com/yanuoda/nidle/commit/879afc2722ec3c81aed699a3c7bf7f6a5316c841))
* 用户登录及 gitlab 授权登录 ([641b1a0](https://github.com/yanuoda/nidle/commit/641b1a03cde15b43a95322650bcd7be891128790))
* 优化服务器管理模块细节,引入弹窗销毁'destroyOnClose'以解决表单'initialValues'不更新的问题 ([b6e6241](https://github.com/yanuoda/nidle/commit/b6e6241f58db7dd84b8080abd9124779613874e1))
* 预发、生产发布 ([404a4f4](https://github.com/yanuoda/nidle/commit/404a4f4fe30c3b2eba691c6d40d630c22098d5ba))
* 预发、生产发布 ([54c152a](https://github.com/yanuoda/nidle/commit/54c152ae7ee58c754403a6ea5519183e82f44a24))
* 增加调度器开始、结束日志 ([994daa5](https://github.com/yanuoda/nidle/commit/994daa57ad155c6aa1137259217169f5fd67074d))
* 增加active字段标识changelog已禁用 ([157c3f3](https://github.com/yanuoda/nidle/commit/157c3f3813c8606d145f631f843431ac5352a815))
* 展示应用成员 ([4b5bc60](https://github.com/yanuoda/nidle/commit/4b5bc60f62ce343490cd1781c698eee7a9705390))
* 整合服务器管理模块，把设置由页面改为弹窗 ([ef6d239](https://github.com/yanuoda/nidle/commit/ef6d2395f8bccb2366e981d366cc96ccbd6b2d66))
* 状态更新配置检查 ([5ae7095](https://github.com/yanuoda/nidle/commit/5ae709578aee86c72870971e08882246c329ad64))
* add cancel() & 取消缓存功能 ([846b01e](https://github.com/yanuoda/nidle/commit/846b01eba0a5f01a3b943b17638856d152a844ff))
* add codeReviewStatus Enum value=PENDING 要来判断是否在等待codereivew ([604c058](https://github.com/yanuoda/nidle/commit/604c058028021788aae5226bdb8453bb99b32712))
* add description prop ([5a63e17](https://github.com/yanuoda/nidle/commit/5a63e17cdacf88d79295ffa74002af11a20b0fc5))
* add message event, codeReview通过事件传递 ([6f394f9](https://github.com/yanuoda/nidle/commit/6f394f9e1051c3749b111a4e4af9f76b63436b67))
* add source branch ([d9d9dea](https://github.com/yanuoda/nidle/commit/d9d9dea63275dfb5f4d06a868ad4fe31174e6512))
* add source config ([03062c7](https://github.com/yanuoda/nidle/commit/03062c7e668a7ed97a0f75741d81af1436c5ebcc))
* cache add module property ([e18d98e](https://github.com/yanuoda/nidle/commit/e18d98e7f0b3a138c08a83aeb1f61979b3ac3cb4))
* cancel改为同步事件 ([d61a62d](https://github.com/yanuoda/nidle/commit/d61a62db238e9d22c816522dad5b85bd0ef5fa94))
* commitId ([f15a4e5](https://github.com/yanuoda/nidle/commit/f15a4e5a008d71a44d76ef5f874affdf8a89b155))
* completed 备份 ([de03bc4](https://github.com/yanuoda/nidle/commit/de03bc4b1f39bd3540414ae6471bc503fa6fdedc))
* completed/error事件 ([f6a51bd](https://github.com/yanuoda/nidle/commit/f6a51bd169e349ff5ec738313f4a2045af1c6c0a))
* default config ([5d81e8e](https://github.com/yanuoda/nidle/commit/5d81e8eb7d7b41601ac231c62fb98afc0949f58a))
* gitlab api plugin ([d0a3781](https://github.com/yanuoda/nidle/commit/d0a37817f58a7dc53f3fceb0d9865643fe74888e))
* input group ([52c8eb0](https://github.com/yanuoda/nidle/commit/52c8eb0ee178994c46a6997554c868a08a1094bc))
* input group ([845ec6a](https://github.com/yanuoda/nidle/commit/845ec6a72eabb37e76b4ed9167def4f15abe0328))
* input to antd-pro form ([ea3a360](https://github.com/yanuoda/nidle/commit/ea3a360890dc208f1623e9ef3f8553ffbdcab711))
* input to antd-pro form ([fb2f770](https://github.com/yanuoda/nidle/commit/fb2f7704c7dd166c47541762b840be4c262f1adf))
* input提交 ([12e05a5](https://github.com/yanuoda/nidle/commit/12e05a588e87cf0936061fc87c257a139e9ae2ab))
* input值提交，并转换成nidle-core想要的值 ([d49cc27](https://github.com/yanuoda/nidle/commit/d49cc27e011fd378025dbd91d8d3409d59e44054))
* log file name ([a44917c](https://github.com/yanuoda/nidle/commit/a44917cceb74316bf58dcf9b0b54524cc04653be))
* manifest plugi ([6d53fd3](https://github.com/yanuoda/nidle/commit/6d53fd32b99c5af2c29d60fec6eef4faffed0016))
* merge request hook ([9825137](https://github.com/yanuoda/nidle/commit/9825137933b65320e0c784d9a6a33644ccbd4325))
* merge-request plugin ([1360196](https://github.com/yanuoda/nidle/commit/136019649def292dfc6b4c705e5eb7afb6164197))
* nidle-chain ([bd99ee8](https://github.com/yanuoda/nidle/commit/bd99ee8ea669a787dd9a7241519a431b40e443d5))
* nvm插件 ([e8578ca](https://github.com/yanuoda/nidle/commit/e8578ca7bf827dd9461434d4314fcc72102b1375))
* retry & timeout控制、失败处理 ([d0e3362](https://github.com/yanuoda/nidle/commit/d0e3362315035a1704bf5bbccc2433029d82cccb))
* update release script ([dda7d03](https://github.com/yanuoda/nidle/commit/dda7d035837cd7d43d4b1c07ac21378007ac6fb3))


### Reverts

* 撤销测试代码 ([126566c](https://github.com/yanuoda/nidle/commit/126566c601f0f8d4fc790a4b28839977080e439d))
* 调度器不再做input diff ([7f04ecb](https://github.com/yanuoda/nidle/commit/7f04ecbce015429c941221e5b4e65a455bfa9062))
* 多余文件 ([72ba305](https://github.com/yanuoda/nidle/commit/72ba30503d94bc1b8ab69099d6808fac0bb9aebc))
* 删错代码 ([fb692c7](https://github.com/yanuoda/nidle/commit/fb692c7ef64d7a8b8ce38ee99f929cdc737963e3))
