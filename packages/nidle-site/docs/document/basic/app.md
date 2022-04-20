---
id: app
sidebar_position: 2
---

# 添加应用 & 应用设置
首先我们要将应用添加进来，并完成一些设置：
* 基础配置：仓库信息
* 服务器配置：服务器选择 & 部署目录
* 项目成员：自动同步git项目成员
* 通知管理：*建设中*
* 代码仓库调整：发布配置

## 代码仓库调整
其他信息都是在界面上维护，所以不再赘述；这里着重讲我们依赖代码仓库中新增的一些发布配置文件

### nidle.[mode].config.js
发布配置文件。具体配置参考[进阶 - 配置](../advanced/config)，可完整配置，也可以通过extend模板进行扩展。

*mode 代表发布环境，如果对应的发布环境没有配置文件，则该发布环境直接发布成功，等待进入下一阶段。*

### node版本依赖
如果项目依赖特定node版本，可以通过以下方式指定 (默认版本8.17.0)

* package.json
```json
# package.json
{
  ...
  engines: {
    "node": ">= 8.0.0 < 9.0.0"
  }
}
```
* .npmrc

### 编译脚本（shell）
编译脚本执行编译任务，并将编译结果输出到指定目录；这样就方便Nidle同步输出文件以用于后续的代码优化或部署流程。

还是以 `Vue assets` 为例

*默认`release.sh`；注意给脚本开放所有人权限，以保证能执行。*
```shell
#!/bin/bash
printf "开始编译构建\n"

printf "删除dist\n"
rm -rf dist;


printf "编译构建\n"
npm run build;

printf "编译构建结束\n"
```
