const path = require('path')
const chalk = require('chalk')
const { validateIfDepsUpdate } = require('../utils')

async function diffSpaDeps(root, tempDir) {
  await validateIfDepsUpdate(path.resolve(root, 'nidle-spa'), path.resolve(tempDir, 'nidle-spa'))
}

async function diffWebDeps(root, tempDir) {
  await validateIfDepsUpdate(path.resolve(root, 'nidle-web'), path.resolve(tempDir, 'nidle-web'))
}

async function diffDeps(root, tempDir) {
  const isSpaDepsUpdate = await diffSpaDeps(root, tempDir)
  const isWebDepsUpdate = await diffWebDeps(root, tempDir)

  console.log(
    chalk.yellow(
      `${
        isSpaDepsUpdate ? '  nidle-spa 依赖有变化，将会重新下载！' : '  nidle-spa 依赖无变化，将沿用之前的 node_modules'
      }\n${
        isWebDepsUpdate ? '  nidle-web 依赖有变化，将会重新下载！' : '  nidle-web 依赖无变化，将沿用之前的 node_modules'
      }\n`
    )
  )
  return { isSpaDepsUpdate, isWebDepsUpdate }
}

module.exports = {
  diffSpaDeps,
  diffWebDeps,
  diffDeps
}
