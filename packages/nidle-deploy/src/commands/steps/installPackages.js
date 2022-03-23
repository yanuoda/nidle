const process = require('process')
const path = require('path')
const execa = require('execa')
const { step, errorLog } = require('../utils/log')

/**
 * 安装 spa 依赖包
 * @param {String} outPath nidle 下载目录
 */
async function installSpaPackages(outPath) {
  try {
    const spaRoot = path.resolve(outPath, 'nidle-spa')
    step('开始下载 nidle-spa 依赖...')
    process.chdir(spaRoot)
    await execa('yarn', [], { stdio: 'inherit' })
    step('下载 nidle-spa 依赖成功！')
  } catch (err) {
    errorLog(`nidle-spa 依赖包安装失败，请重试！\n${err.message}`)
  }
}

/**
 * 安装 web 依赖包
 * @param {String} outPath nidle 下载目录
 */
async function installWebPackages(outPath) {
  try {
    const webRoot = path.resolve(outPath, 'nidle-web')
    step('开始下载 nidle-web 依赖...')
    process.chdir(webRoot)
    await execa('yarn', [], { stdio: 'inherit' })
    step('下载 nidle-web 依赖成功！')
  } catch (err) {
    errorLog(`nidle-web 依赖包安装失败，请重试！\n${err.message}`)
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
