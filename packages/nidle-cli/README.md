# `nidle-cli`

> `nidle` 脚手架

## Features

- 自动化安装启动 `nidle`
- 选定版本迁移更新
- 支持断点续装

## Install

```bash
$ npm install nidle-cli -g
```

## Usage

```bash
$ nidle-cli setup/update
# help
$ nidle-cli <command> --help
```

## API

```
// setup
const setup = require('nidle-cli/src/commands/setup')
setup(outputPath, version, retryFlag)
// update
const update = require('nidle-cli/src/commands/update')
update(newVersion, retryFlag)
```

## License

MIT
