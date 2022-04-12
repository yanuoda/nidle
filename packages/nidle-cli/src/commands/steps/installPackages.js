const process = require('process')
const path = require('path')
const execa = require('execa')
const { Logger } = require('../utils')

/**
 * 安装 spa 依赖包
 * @param {String} outPath nidle 下载目录
 */
async function installSpaPackages(outPath) {
  const logger = new Logger('下载 nidle-spa 依赖')

  try {
    logger.step()
    const spaRoot = path.resolve(outPath, 'nidle-spa')
    process.chdir(spaRoot)
    await execa('yarn', [], { stdio: 'pipe' })
    process.chdir(process.cwd())
    logger.success()
  } catch (err) {
    logger.error(`nidle-spa 依赖包安装失败，请重试！\n${err.message}`)
  }
}

/**
 * 安装 web 依赖包
 * @param {String} outPath nidle 下载目录
 */
async function installWebPackages(outPath) {
  const logger = new Logger('下载 nidle-web 依赖')

  try {
    logger.step()
    const webRoot = path.resolve(outPath, 'nidle-web')
    process.chdir(webRoot)
    await execa('yarn', ['install', '--prod'], { stdio: 'pipe' })
    process.chdir(process.cwd())
    logger.success()
  } catch (err) {
    logger.error(`nidle-web 依赖包安装失败，请重试！\n${err.message}`)
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
