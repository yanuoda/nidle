# `nidle-plugin-build`

> nidle plugin of build the target file into a production bundle for deployment

## Install
```
npm install nidle-plugin-build
```

## Usage
`build` 通过运行编译脚本(buildShell)，编译脚本将编译结果输出到 `output`目录，然后会将 `output`目录拷贝到 `config.output.path`，以便后面的插件操作的是编译结果。

## Configuration
* **output**: 编译目标目录；默认 `./dist`
* **buildShell**: 编译脚本；默认 `./release.sh`
