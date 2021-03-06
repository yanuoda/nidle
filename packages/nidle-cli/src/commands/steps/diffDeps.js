const path = require('path')
const chalk = require('chalk')
const { validateIfDepsUpdate, validateIfDevDepsUpdate, Logger } = require('../utils')

function diffSpaDeps(root, tempDir) {
  const isDepsUpdate = validateIfDepsUpdate(path.resolve(root, 'nidle-spa'), path.resolve(tempDir, 'nidle-spa'))
  const isDevDepsUpdate = validateIfDevDepsUpdate(path.resolve(root, 'nidle-spa'), path.resolve(tempDir, 'nidle-spa'))
  return isDepsUpdate || isDevDepsUpdate
}

function diffWebDeps(root, tempDir) {
  return validateIfDepsUpdate(path.resolve(root, 'nidle-web'), path.resolve(tempDir, 'nidle-web'))
}

async function diffDeps(root, tempDir) {
  try {
    const isSpaDepsUpdate = diffSpaDeps(root, tempDir)
    const isWebDepsUpdate = diffWebDeps(root, tempDir)

    console.log(
      chalk.yellow(
        `${
          isSpaDepsUpdate
            ? '  nidle-spa 依赖有变化，将会重新下载！'
            : '  nidle-spa 依赖无变化，将沿用之前的 node_modules'
        }\n${
          isWebDepsUpdate
            ? '  nidle-web 依赖有变化，将会重新下载！'
            : '  nidle-web 依赖无变化，将沿用之前的 node_modules'
        }\n`
      )
    )
    return { isSpaDepsUpdate, isWebDepsUpdate }
  } catch (err) {
    new Logger('对比 nidle-spa 和 nidle-web 依赖项是否有变化').error(`依赖项 diff 失败！\n${err}`)
  }
}

module.exports = {
  diffSpaDeps,
  diffWebDeps,
  diffDeps
}
