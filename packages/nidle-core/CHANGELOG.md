## [0.1.7](https://github.com/yanuoda/nidle/compare/v0.1.6...v0.1.7) (2022-03-01)


### Bug Fixes

* 延迟推送消息保证日志输出完整 ([f6a59a1](https://github.com/yanuoda/nidle/commit/f6a59a13ad78ebc7bd3fe3972136b6e0cc617a23))



## [0.1.6](https://github.com/yanuoda/nidle/compare/v0.1.5...v0.1.6) (2022-03-01)



## [0.1.5](https://github.com/yanuoda/nidle/compare/v0.1.4...v0.1.5) (2022-03-01)



## [0.1.4](https://github.com/yanuoda/nidle/compare/v0.1.3...v0.1.4) (2022-02-18)



## [0.1.3](https://github.com/yanuoda/nidle/compare/v0.1.2...v0.1.3) (2022-02-10)



## [0.1.2](https://github.com/yanuoda/nidle/compare/v0.1.1...v0.1.2) (2022-02-08)



## 0.1.1 (2022-01-26)


### Bug Fixes

* 错误后结束任务 ([75c7236](https://github.com/yanuoda/nidle/commit/75c7236868f0abff562883ba2ac1cd87f8003063))
* 错误时不触发completed事件 ([4fece3e](https://github.com/yanuoda/nidle/commit/4fece3e70211d11dff2d3c8572a035b8b086298a))
* 错误信息没有正确记录 ([d87a58d](https://github.com/yanuoda/nidle/commit/d87a58d2d299c4127059ea2855dd719f4e73dc8f))
* 局部缓存retry/timeout字段，解决丢失问题 ([230d400](https://github.com/yanuoda/nidle/commit/230d4003ec85e8425fff513235078d9a03dbf998))
* 修复一些发布的问题 ([0bf8ef8](https://github.com/yanuoda/nidle/commit/0bf8ef8b15bfd7c8e2bbac7eaf1c8506356c74ab))
* 需要主动init，因为要返回inputs ([dc98984](https://github.com/yanuoda/nidle/commit/dc98984254aaf7549fec1798fd7dfec29c67670d))
* cache缓存容易混淆，所以备份直接从构建备份 ([f26f113](https://github.com/yanuoda/nidle/commit/f26f113ae7a7c112a57534c281fee32de3c7ae49))
* error错误输出 ([2d0ec64](https://github.com/yanuoda/nidle/commit/2d0ec6450d83065ee98458b7098d4d8e38d9f961))
* extend options ([dde15cb](https://github.com/yanuoda/nidle/commit/dde15cbdc4b0d58d723ceee6478e216bcb0f253e))
* input & input(options) ([7f5d441](https://github.com/yanuoda/nidle/commit/7f5d4414bf1558ed6556a3a73ee38a88434d19a7))
* input 增加step后combine判断修改 ([795c691](https://github.com/yanuoda/nidle/commit/795c6912094d2b111c78e7433febb94e938ee6c5))
* input是跟插件绑定的，应该用插件路径当key做缓存 ([c6fefba](https://github.com/yanuoda/nidle/commit/c6fefba8b1d853b10b9facbcc12abab57514bbfa))
* jest跑不起来问题 ([633a743](https://github.com/yanuoda/nidle/commit/633a743c92e9cae9e7b2a3eaefd09c7fa00c2d6a))
* log文件路径由配置提供 ([48dd830](https://github.com/yanuoda/nidle/commit/48dd83032b0aa1c2fb1b9bf39aee5a121d665702))
* log文件路径由配置提供 ([14b2415](https://github.com/yanuoda/nidle/commit/14b2415eaf3b3041c01c63a9dbd6f7e5c87a512a))
* source 路径唯一 ([86386d8](https://github.com/yanuoda/nidle/commit/86386d893bce94d06791aabea3ba2918a44e8020))
* task实例引用错误 ([661ef85](https://github.com/yanuoda/nidle/commit/661ef8515685513d0681181d0a7aa2d018a4cdb4))
* try catch throw error ([24c6900](https://github.com/yanuoda/nidle/commit/24c6900bfec41102398ca94a5f1b7d3ef32e172e))
* update函数通过挂载绑定 ([b8407b6](https://github.com/yanuoda/nidle/commit/b8407b638120fe5d67bba60f564ffc107f6bd243))


### Features

* 备份功能 ([66bd36a](https://github.com/yanuoda/nidle/commit/66bd36a745c4daf2889916bbe3586010a69d8350))
* 插件挂载调度基础 ([1988a46](https://github.com/yanuoda/nidle/commit/1988a46cf64a515c5aa98411f322582d1ed3fc29))
* 调度器类 ([8ba6f1f](https://github.com/yanuoda/nidle/commit/8ba6f1f65118b1d69785b6aac327522b9714e94f))
* 给安全的插件传入私密配置 ([859a5ed](https://github.com/yanuoda/nidle/commit/859a5ed564ac1a157a28950db75adaf75f2eb864))
* 配置项处理及单测 ([5d8fd2c](https://github.com/yanuoda/nidle/commit/5d8fd2cce1bd2a0ef407b2f816237b3f54810174))
* 日志模块 ([b49fb1b](https://github.com/yanuoda/nidle/commit/b49fb1b608cf42611a9976acdb9b6d5484aef5fe))
* 压缩、拷贝目标目录不存在时创建目录 ([0b52b62](https://github.com/yanuoda/nidle/commit/0b52b62aed4c51f09c2dec7d091c477f27b57d18))
* 压缩包统一文件名 .tar.gz ([e0aef38](https://github.com/yanuoda/nidle/commit/e0aef38e4538176be991e3501c914d6d108def7d))
* 增加调度器开始、结束日志 ([994daa5](https://github.com/yanuoda/nidle/commit/994daa57ad155c6aa1137259217169f5fd67074d))
* 状态更新配置检查 ([5ae7095](https://github.com/yanuoda/nidle/commit/5ae709578aee86c72870971e08882246c329ad64))
* add cancel() & 取消缓存功能 ([846b01e](https://github.com/yanuoda/nidle/commit/846b01eba0a5f01a3b943b17638856d152a844ff))
* add description prop ([5a63e17](https://github.com/yanuoda/nidle/commit/5a63e17cdacf88d79295ffa74002af11a20b0fc5))
* add message event, codeReview通过事件传递 ([6f394f9](https://github.com/yanuoda/nidle/commit/6f394f9e1051c3749b111a4e4af9f76b63436b67))
* add source config ([03062c7](https://github.com/yanuoda/nidle/commit/03062c7e668a7ed97a0f75741d81af1436c5ebcc))
* cache add module property ([e18d98e](https://github.com/yanuoda/nidle/commit/e18d98e7f0b3a138c08a83aeb1f61979b3ac3cb4))
* cancel改为同步事件 ([d61a62d](https://github.com/yanuoda/nidle/commit/d61a62db238e9d22c816522dad5b85bd0ef5fa94))
* completed 备份 ([de03bc4](https://github.com/yanuoda/nidle/commit/de03bc4b1f39bd3540414ae6471bc503fa6fdedc))
* completed/error事件 ([f6a51bd](https://github.com/yanuoda/nidle/commit/f6a51bd169e349ff5ec738313f4a2045af1c6c0a))
* default config ([5d81e8e](https://github.com/yanuoda/nidle/commit/5d81e8eb7d7b41601ac231c62fb98afc0949f58a))
* log file name ([a44917c](https://github.com/yanuoda/nidle/commit/a44917cceb74316bf58dcf9b0b54524cc04653be))
* retry & timeout控制、失败处理 ([d0e3362](https://github.com/yanuoda/nidle/commit/d0e3362315035a1704bf5bbccc2433029d82cccb))


### Reverts

* 撤销测试代码 ([126566c](https://github.com/yanuoda/nidle/commit/126566c601f0f8d4fc790a4b28839977080e439d))
* 调度器不再做input diff ([7f04ecb](https://github.com/yanuoda/nidle/commit/7f04ecbce015429c941221e5b4e65a455bfa9062))
* 多余文件 ([72ba305](https://github.com/yanuoda/nidle/commit/72ba30503d94bc1b8ab69099d6808fac0bb9aebc))
* 删错代码 ([fb692c7](https://github.com/yanuoda/nidle/commit/fb692c7ef64d7a8b8ce38ee99f929cdc737963e3))



