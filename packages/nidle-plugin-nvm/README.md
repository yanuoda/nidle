# `nidle-plugin-nvm`

> nidle plugin of nvm node version manager，required `nvm`

## Install
```
npm install nidle-plugin-nvm
```

## Usage
如果您有多个项目，且依赖不同的 `node version`，那么可以使用该插件.

`nidle-plugin-nvm` 会根据
* .nvmrc （`优先`）
* package.json > engines > node

获取应用所需的`node version`，并修改`task.processOptions.execPath`指向正确的 node 执行文件。

## WHY
#### 为什么`nidle-plugin-nvm`不直接`nvm use`管理应用的 node 版本，而是只给出执行文件路径？

> nvm is a version manager for node.js, designed to be installed per-user, and invoked per-shell.

先看nvm官方原文，nvm的版本管理在多个shell脚本中是互相独立的；

我们的插件一般是开启子进程来执行一些shell脚本，子进程默认情况又是继承自父进程的（除非指定execPath）；

所以能想到的办法就是在调度器中起一个父进程，并让其使用正确 node 版本，再通过它去调度插件；

但是由于目前调度器中上下文太多，很难通过 shell 执行某个 js 文件去保持上下文；所以暂缓。

#### `nvm alias default` 不是会修改默认 node 版本，新起的 shell 都会继承吗？
是的，在 Terminal 中起多个窗口，这是正常的；但是我们尝试过子进程好像表现并不像是新起 shell，而是衍生 shell，现象是会继承父进程的环境
