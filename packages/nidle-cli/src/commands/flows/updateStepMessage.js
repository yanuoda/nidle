module.exports = [
  '下载 nidle 源码压缩包并解压',
  '检查本地 nidle-cli 的版本是否满足安装条件',
  '检查 nidle-spa 和 nidle-web 的依赖是否有更新',
  '配置 nidle-web .env 文件新增配置项',
  '停止 nidle-web 正在运行的服务（yarn stop）',
  '将下载的新版 nidle 源码覆盖旧版源码',
  '如果 nidle-spa 的依赖项有更新，则重新下载依赖',
  '如果 nidle-web 的依赖项有更新，则重新下载依赖',
  '打包 nidle-spa 并将生成的静态资源放到 nidle-web/app/public 静态资源目录下',
  '运行 nidle-web 下的数据库生成及迁移脚本（yarn db:create）',
  '启动 nidle-web 服务（yarn start）'
]
