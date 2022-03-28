# `nidle-plugin-scp`

> nidle plugin of secure copy

## Install
```
npm install nidle-plugin-scp
```

## Usage
`scp` 将编译构建后的代码 `scp` 同步到目标服务器，为了同步速度，会先压缩然后再同步，同步到服务器后，可以选择是否解压文件到服务器目标目录。

## Configuration
* **servers**: 发布服务器列表；内部配置，会读取应用的服务器列表，也可以临时新增一台服务器做灰度；
* **decompress**: 同步完成后是否解压；默认 `false`；类似 node 应用，同步完后要登录服务器起服务，那么建议先不解压；
* **authenticity**: 服务器是否需要密码认证；默认 `true`；判断是否需要，可以通过 `ssh` 登录服务器，看是否需要输入密码，不需要则为 `false`；
