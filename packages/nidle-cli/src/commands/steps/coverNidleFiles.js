const path = require('path')
const copyDir = require('../utils/copyDir')
const { rm } = require('../utils/mkdirAndRm')
const { errorLog } = require('../utils/log')

module.exports = async function coverNidleFiles(oldPath, tempPath, isSpaDepsUpdate, isWebDepsUpdate) {
  const rmSpaGlob = isSpaDepsUpdate ? 'nidle-spa/**' : 'nidle-spa/{!(node_modules),.*}'
  const rmWebGlob = isWebDepsUpdate ? 'nidle-web/**' : 'nidle-web/!(node_modules)'

  await rm(rmSpaGlob)
  await rm(rmWebGlob)

  await copyDir(path.resolve(tempPath, './nidle-spa'), path.resolve(oldPath, './nidle-spa')).catch(err => {
    errorLog(`nidle-spa 更新文件覆盖失败，请重试！\n${err.message}`)
  })
  await copyDir(path.resolve(tempPath, './nidle-web'), path.resolve(oldPath, './nidle-web')).catch(err => {
    errorLog(`nidle-web 更新文件覆盖失败，请重试！\n${err.message}`)
  })
}