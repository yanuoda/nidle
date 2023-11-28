# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.2.8-alpha.0](https://github.com/yanuoda/nidle/compare/v0.2.7-alpha.0...v0.2.8-alpha.0) (2023-11-28)


### Bug Fixes

* node_modules目录存在时走 npm update, 保证能更新到新版本 ([455d4c3](https://github.com/yanuoda/nidle/commit/455d4c3ba6ed9d03d4d68ef0a97b5f6ccca6311a))





## [0.2.7-alpha.0](https://github.com/yanuoda/nidle/compare/v0.2.6-alpha.0...v0.2.7-alpha.0) (2023-11-24)

**Note:** Version bump only for package nidle-web





## [0.2.6-alpha.0](https://github.com/yanuoda/nidle/compare/v0.2.5-alpha.0...v0.2.6-alpha.0) (2023-11-24)

**Note:** Version bump only for package nidle-web





## [0.2.5-alpha.0](https://github.com/yanuoda/nidle/compare/v0.2.4-alpha.0...v0.2.5-alpha.0) (2023-11-24)

**Note:** Version bump only for package nidle-web





## [0.2.4-alpha.0](https://github.com/yanuoda/nidle/compare/v0.2.3-alpha.0...v0.2.4-alpha.0) (2023-11-24)

**Note:** Version bump only for package nidle-web





## [0.2.3-alpha.0](https://github.com/yanuoda/nidle/compare/v0.2.2-alpha.0...v0.2.3-alpha.0) (2023-11-09)

**Note:** Version bump only for package nidle-web





## [0.2.1-alpha.0](https://github.com/yanuoda/nidle/compare/v0.2.0-alpha.0...v0.2.1-alpha.0) (2023-08-10)

**Note:** Version bump only for package nidle-web





# [0.2.0-alpha.0](https://github.com/yanuoda/nidle/compare/v0.1.8...v0.2.0-alpha.0) (2023-08-10)


### Bug Fixes

* 发布生产备份 ([58e8eea](https://github.com/yanuoda/nidle/commit/58e8eeac088acc2d1896cfd4b167bc6d573f6962))
* 服务器适配 ([e878011](https://github.com/yanuoda/nidle/commit/e878011fde2dad626cefc28ba30d7a9d916c7caf))
* 配置信息参数新增判断是否是新建发布 ([cd98a04](https://github.com/yanuoda/nidle/commit/cd98a0443215f0e15e6e7fe2f30c0a394fa90c6e))
* 删除不必要参数字段 ([c878b17](https://github.com/yanuoda/nidle/commit/c878b179919e9a77759f3c0a8ab8e88994ca24c5))
* 退出发布清除缓存 ([c3af57e](https://github.com/yanuoda/nidle/commit/c3af57ecf5ef93f3af15a7304f6ba0f232e82840))
* 退出发布设为禁用无法重新发布问题修复 ([16746df](https://github.com/yanuoda/nidle/commit/16746df14344aaefaba726678211c704a8ae8350))
* 新建发布commitid ([0260b03](https://github.com/yanuoda/nidle/commit/0260b032e888bb3d64245b95bcb602d79defea10))
* 修复 nidle-web 服务 IP 和端口配置不生效的问题 ([35a4c36](https://github.com/yanuoda/nidle/commit/35a4c36b2495ffd118f0b8d83fed90a88f5a54a5))
* 修复应用查询时空字段导致无查询结果的问题 ([c4b0e98](https://github.com/yanuoda/nidle/commit/c4b0e98bde85cc3616d98ab0fd0a285f244b2cf2))
* 只返回20条分支；放开限制到100条；如果以后还超出这个限制，需做分页处理 ([dd33a3d](https://github.com/yanuoda/nidle/commit/dd33a3d27d47cdfe518b47890cb7430604e1ad54))
* github关联跳转 ([d8cc01e](https://github.com/yanuoda/nidle/commit/d8cc01e8b3502eb8f1ba7caba68a8c1c799a117f))
* ignore /api router ([d7c6dd2](https://github.com/yanuoda/nidle/commit/d7c6dd2dd66005d2f1eb4a84069795199a27117a))
* merge request close 不触发 webhook自动化发布 ([6cc76b9](https://github.com/yanuoda/nidle/commit/6cc76b974663912727f5a2e6e36d1251bc3c0c11))
* next type ([dcd9eaf](https://github.com/yanuoda/nidle/commit/dcd9eaf250ca6f37692574074e49ccb80c4894bd))
* router 伪装图片兜底处理 ([e17fa91](https://github.com/yanuoda/nidle/commit/e17fa91aef51b1d0d8af9091d9aad0492f700bbe))
* webhook request newest commit id ([a3061bf](https://github.com/yanuoda/nidle/commit/a3061bf0697ee2978f3cf90aef4bd42b1282e6d5))
* webhook判断 ([f761a7a](https://github.com/yanuoda/nidle/commit/f761a7aa41e73abc08c2d29b50ff9944f3bf82e4))


### Features

*  github support ([ac9cfa3](https://github.com/yanuoda/nidle/commit/ac9cfa38abb255d02e1dd610c0c49a4217c0914e))
* 更新命令对 nidle-web 配置项做差异化问询 ([fbdb437](https://github.com/yanuoda/nidle/commit/fbdb437d9126295b4c36c2dc09f86f03b379d958))
* 添加数据库服务端口配置项 ([a24d8fe](https://github.com/yanuoda/nidle/commit/a24d8fe6e3ff9efa49e3abe07f9d8b263f6f5dbd))
* 账号关联 ([8093a4d](https://github.com/yanuoda/nidle/commit/8093a4d3f93029fff9e48db3f2207880c23941ab))
* 账号关联及应用权限判断 ([1b0ce56](https://github.com/yanuoda/nidle/commit/1b0ce5600c0ea8d9cac5dcdfb371b45698fd20b5))
* history api fallback ([d094f33](https://github.com/yanuoda/nidle/commit/d094f332befd9b83b65db144346bf72300432072))
* nidle 一键部署 ([dff8337](https://github.com/yanuoda/nidle/commit/dff8337a34ad17e7235bf36294acc38729084dec))
* nidle-cli 日志输出优化 ([17bdcba](https://github.com/yanuoda/nidle/commit/17bdcba9881ee3be7c19a7bc01990de448aaf35a))
* nidle-web 添加对 nidle-cli 的依赖版本范围功能 ([6b7e10c](https://github.com/yanuoda/nidle/commit/6b7e10c5e6d369fd07ddce63882a4fae9d523ced))
* webhook publish ([e2132fc](https://github.com/yanuoda/nidle/commit/e2132fcd4c7e63e6abe451660a40d9d882c2d198))
* webhook publish success 停留在当前发布环境，可以退出 ([c755a5e](https://github.com/yanuoda/nidle/commit/c755a5ec6499a98fc8da6d8055859b5e1c351954))
* webhook支持多记录同时运行 ([781b0f9](https://github.com/yanuoda/nidle/commit/781b0f9f39e6e411119a0db268d72a9705b1d068))


### Reverts

* 还原调试代码 ([cc49063](https://github.com/yanuoda/nidle/commit/cc4906345efe02b7e5ca5206ec56064e2e108390))





## [0.1.8](https://github.com/yanuoda/nidle/compare/v0.1.7...v0.1.8) (2022-03-02)


### Bug Fixes

* 插件没执行完时日志截取不完整问题修复 ([8a52e70](https://github.com/yanuoda/nidle/commit/8a52e70557913f08a2f4850f2f623a8abd5512b5))
* 发布生产成功后释放机器 ([c88943d](https://github.com/yanuoda/nidle/commit/c88943d82e1e9de3c16e07561a52d8137e496135))


### Features

* 增加结束后延迟关闭后台进程，保证日志输出完整性 ([10bcd70](https://github.com/yanuoda/nidle/commit/10bcd704ef6aefb39711d9369f142eb74d4abfb5))



## [0.1.7](https://github.com/yanuoda/nidle/compare/v0.1.6...v0.1.7) (2022-03-01)



## [0.1.6](https://github.com/yanuoda/nidle/compare/v0.1.5...v0.1.6) (2022-03-01)


### Bug Fixes

* 修复项目设置页修改服务器信息报错 ([c1146fe](https://github.com/yanuoda/nidle/commit/c1146fe8e8cd4673b7c41d16bd09ba485a4037b7))



## [0.1.5](https://github.com/yanuoda/nidle/compare/v0.1.4...v0.1.5) (2022-03-01)



## [0.1.4](https://github.com/yanuoda/nidle/compare/v0.1.3...v0.1.4) (2022-02-18)


### Bug Fixes

* 日志格式化问题 ([ba0c2c1](https://github.com/yanuoda/nidle/commit/ba0c2c13321a94615ed87fbec217aaf87f7d1c54))
* 应用配置没有执行chain ([afd511b](https://github.com/yanuoda/nidle/commit/afd511ba678c3e08259880c88cee14f3d60a2d15))
* 重新发布commitId错误 ([d8287f0](https://github.com/yanuoda/nidle/commit/d8287f0af435b2ced74a002d6037af74ccd26b1c))
* dataType=text message undefined ([346b275](https://github.com/yanuoda/nidle/commit/346b2756b5b38323d391d5602dfab816654b4f55))


### Features

* 发布记录状态展示环境信息 ([da0d977](https://github.com/yanuoda/nidle/commit/da0d977b79bbd901ac34a6d82d40807715e90104))



## [0.1.3](https://github.com/yanuoda/nidle/compare/v0.1.2...v0.1.3) (2022-02-10)


### Bug Fixes

* chain function must require from js file ([3e17725](https://github.com/yanuoda/nidle/commit/3e17725fdb845b131cc5bf6c654b1139b7bffb35))
* changelog projectName ([8f06576](https://github.com/yanuoda/nidle/commit/8f0657634a2dc87f720f8a6b14cd22df54f57c3e))
* dataType ([a9cfc18](https://github.com/yanuoda/nidle/commit/a9cfc18790bec0e14ed23cf4cb8debd1d3e9c30e))
* default value ([e0ba268](https://github.com/yanuoda/nidle/commit/e0ba2683ca51f8488799a7258f0fcf4ef4f6809b))



## [0.1.2](https://github.com/yanuoda/nidle/compare/v0.1.1...v0.1.2) (2022-02-08)


### Features

* 修改密码页 ([d19e4af](https://github.com/yanuoda/nidle/commit/d19e4afebacbbf1a72c2989cf1abcc33b53065fc))
* mailer ([f92ad20](https://github.com/yanuoda/nidle/commit/f92ad20d30f9c8b967f54bf56e43e15d69543b76))



## 0.1.1 (2022-01-26)


### Bug Fixes

* 保存应用信息后返回应用名不正确 ([0fc90e1](https://github.com/yanuoda/nidle/commit/0fc90e17080faf233e2070bec1cb984449e9ffd2))
* 刚创建就取消发布状态、日志问题修复 ([0f5cc44](https://github.com/yanuoda/nidle/commit/0f5cc440bc0c1f917c717485f8a58022c00ab593))
* 获取配置模板 ([db1b297](https://github.com/yanuoda/nidle/commit/db1b2972bbaade6ed8272902a9f32dd7e89324e0))
* 结束后将duration写入表 ([71e31d4](https://github.com/yanuoda/nidle/commit/71e31d4056414c9399fd25b8f02787b4599567b8))
* 失败也是重新创建记录 ([b75c638](https://github.com/yanuoda/nidle/commit/b75c638656f213748f42cad3e4acc1f533ef0c59))
* 通过gitlabid获取配置 ([a0c1d8a](https://github.com/yanuoda/nidle/commit/a0c1d8a8746604688f3ca70909530944bcac50d4))
* 修复新建应用时应用名称获取不准确及报错的问题 ([a82e495](https://github.com/yanuoda/nidle/commit/a82e495ebb4b5be0d02b4ab157083990a34d8b6d))
* 修改 project_member 的 role 字段类型 ([9614e41](https://github.com/yanuoda/nidle/commit/9614e417fac01a57d86eec3c4c4b8274c90b0474))
* add id & update data ([5e1bd49](https://github.com/yanuoda/nidle/commit/5e1bd4966820be99fae3c393457fc0d87e500a89))
* codeReview跳转 ([e625c05](https://github.com/yanuoda/nidle/commit/e625c05ad140af683d4a38757512d638c9bbe72e))
* **db:** 修改数据库字段类型 ([02a09f6](https://github.com/yanuoda/nidle/commit/02a09f655cbf0ccae71636d288dee5685c262dde))
* gitlab请求reponse调整 ([8087264](https://github.com/yanuoda/nidle/commit/8087264333daba1482f964607711d17ce02a5e76))
* merge confict ([c60c5ca](https://github.com/yanuoda/nidle/commit/c60c5ca63f110c4929fbcfe466ddebaf907af333))
* raw = false取值问题 ([2b4563e](https://github.com/yanuoda/nidle/commit/2b4563e0519a29f1f5892f643b6b127b6a5649c2))
* raw=true 取值问题 ([97ff0bf](https://github.com/yanuoda/nidle/commit/97ff0bfab909d7d05edfc3bcc2971ef80c78e45e))
* status default value ([fdd7c13](https://github.com/yanuoda/nidle/commit/fdd7c136720837aa93ee603adcfc3efbff2cdc45))
* value ([3598e87](https://github.com/yanuoda/nidle/commit/3598e8750796eef784629360e711fed666c2928e))


### Features

* 操作部分检查用户是否有权限 ([c623474](https://github.com/yanuoda/nidle/commit/c623474f416c7cad66cc1cb5b1550c2d0e256638))
* 发布列表到发布联调 ([6650394](https://github.com/yanuoda/nidle/commit/665039443993ecd41e8bfd1b155f2290d39a3128))
* 发布列表页 ([640cc37](https://github.com/yanuoda/nidle/commit/640cc378589a4493eaf71a32d490ad1de5a76a75))
* 服务器接口 ([f066b1b](https://github.com/yanuoda/nidle/commit/f066b1bc45d48fcd13b952bc6f4b6ffc463d6af8))
* 获取 gitlab 应用成员并展示 ([2f11de2](https://github.com/yanuoda/nidle/commit/2f11de2da56b2c833a70114cdd3f119a0d302c11))
* 获取应用 owner 和设置默认仓库类型字段 ([5845faf](https://github.com/yanuoda/nidle/commit/5845fafec117848f2deb47f2af9e8b5cda8f3a6c))
* 配置读取相关（暂时mock数据） ([507fec4](https://github.com/yanuoda/nidle/commit/507fec46f24c5ec3354c67a54899347d5b9be1d3))
* 配置模板模块 ([60b42ba](https://github.com/yanuoda/nidle/commit/60b42ba1e47ec92759604a0f5d14e2399ffce190))
* 添加发布脚本 ([229e3fe](https://github.com/yanuoda/nidle/commit/229e3fec61a202d687648a374cf302a8937b18a1))
* 添加服务器查询接口 ([817ecb9](https://github.com/yanuoda/nidle/commit/817ecb944b1a4abc41c794bcb81aad45e12bb73e))
* 添加模板时设置默认启用 ([0452a90](https://github.com/yanuoda/nidle/commit/0452a900209d5a1dc9563fdb3de2fb89532f9b5c))
* 退出发布 ([896eeee](https://github.com/yanuoda/nidle/commit/896eeee0d3439ae02f6603f0369bcd40e49e838f))
* 完成服务器管理模块初版，包括列表展示和查询，表单新增和编辑。待测试后合并 ([77bea52](https://github.com/yanuoda/nidle/commit/77bea52be418424566dde11b866d18ea505cc170))
* 应用列表和新建、编辑应用信息页面及接口 ([879afc2](https://github.com/yanuoda/nidle/commit/879afc2722ec3c81aed699a3c7bf7f6a5316c841))
* 用户登录及 gitlab 授权登录 ([641b1a0](https://github.com/yanuoda/nidle/commit/641b1a03cde15b43a95322650bcd7be891128790))
* 预发、生产发布 ([404a4f4](https://github.com/yanuoda/nidle/commit/404a4f4fe30c3b2eba691c6d40d630c22098d5ba))
* 增加active字段标识changelog已禁用 ([157c3f3](https://github.com/yanuoda/nidle/commit/157c3f3813c8606d145f631f843431ac5352a815))
* add codeReviewStatus Enum value=PENDING 要来判断是否在等待codereivew ([604c058](https://github.com/yanuoda/nidle/commit/604c058028021788aae5226bdb8453bb99b32712))
* commitId ([f15a4e5](https://github.com/yanuoda/nidle/commit/f15a4e5a008d71a44d76ef5f874affdf8a89b155))
* gitlab api plugin ([d0a3781](https://github.com/yanuoda/nidle/commit/d0a37817f58a7dc53f3fceb0d9865643fe74888e))
* input group ([52c8eb0](https://github.com/yanuoda/nidle/commit/52c8eb0ee178994c46a6997554c868a08a1094bc))
* input to antd-pro form ([fb2f770](https://github.com/yanuoda/nidle/commit/fb2f7704c7dd166c47541762b840be4c262f1adf))
* input值提交，并转换成nidle-core想要的值 ([d49cc27](https://github.com/yanuoda/nidle/commit/d49cc27e011fd378025dbd91d8d3409d59e44054))
* merge request hook ([9825137](https://github.com/yanuoda/nidle/commit/9825137933b65320e0c784d9a6a33644ccbd4325))
