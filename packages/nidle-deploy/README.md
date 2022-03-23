# `nidle-deploy`

> `nidle` 一键部署脚手架

## Install

```bash
$ npm install nidle-deploy -g
```

## Usage

```bash
$ nidle-deploy setup/update
# help
$ nidle-deploy <command> --help
```

## API

```
const nidleDeploy = require('nidle-deploy')

// setup
nidleDeploy.setup(outputPath)
// update
nidleDeploy.update(newVersion)
```

## License

MIT
