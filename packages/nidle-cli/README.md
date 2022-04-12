# `nidle-cli`

> `nidle` 脚手架

## Features

- 自动化安装启动 `nidle`
- 选定版本迁移更新

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
const setup = require('nidle-cli/commands/setup')
setup(outputPath)
// update
const update = require('nidle-cli/commands/update')
update(newVersion)
```

## License

MIT
