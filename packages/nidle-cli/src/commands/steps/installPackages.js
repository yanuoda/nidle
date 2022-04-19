const path = require('path')
const { Logger, runCommand } = require('../utils')

/**
 * 安装 spa 依赖包
 * @param {String} outPath nidle 下载目录
 */
async function installSpaPackages(outPath) {
  const logger = new Logger('下载 nidle-spa 依赖')

  try {
    const spaRoot = path.resolve(outPath, 'nidle-spa')
    process.chdir(spaRoot)
    await runCommand('yarn', [])
    process.chdir(process.cwd())
    logger.success()
  } catch (err) {
    logger.error(`nidle-spa 依赖包安装失败，请重试！\n${err}`)
  }
}

/**
 * 安装 web 依赖包
 * @param {String} outPath nidle 下载目录
 */
async function installWebPackages(outPath) {
  const logger = new Logger('下载 nidle-web 依赖')

  try {
    const webRoot = path.resolve(outPath, 'nidle-web')
    process.chdir(webRoot)
    await runCommand('yarn', ['install', '--prod'])
    process.chdir(process.cwd())
    logger.success()
  } catch (err) {
    logger.error(`nidle-web 依赖包安装失败，请重试！\n${err}`)
  }
}

/**
 * 安装所有依赖包
 * @param {String} outPath nidle 下载目录
 */
async function installPackages(outPath) {
  await installSpaPackages(outPath)
  await installWebPackages(outPath)
}

module.exports = {
  installSpaPackages,
  installWebPackages,
  installPackages
}
