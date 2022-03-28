# `nidle-plugin-manifest`

> nidle plugin of sync manifest

## Install
```
npm install nidle-plugin-manifest
```

## Usage
该插件是将 webpack 打包后的 `manifest.json` 内容同步到服务器，用于「模板应用」做静态资源索引用，以便开启浏览器缓存，提高性能。

## Configuration
* **apiUrl**: api url；
* **siteId**: 站点ID；
* **deployId**: 模块ID；
* **mode**: 环境；
