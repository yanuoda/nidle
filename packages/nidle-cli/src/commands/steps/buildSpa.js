const process = require('process')
const path = require('path')
const execa = require('execa')
const copyDir = require('../utils/copyDir')
const { step, errorLog } = require('../utils/log')

/**
 * 编译打包 spa 项目，并复制到 nidle-web 的静态资源目录
 * @param {String} outPath nidle 下载目录
 */
module.exports = async function buildSpa(outPath) {
  step('开始打包构建 nidle-spa...')
  try {
    process.chdir(path.resolve(outPath, 'nidle-spa'))
    await execa('yarn', ['build'], { stdio: 'inherit' })
    await copyDir(path.resolve(outPath, './nidle-spa/dist'), path.resolve(outPath, './nidle-web/app/public')).catch(
      err => {
        errorLog(`nidle-spa 静态资源移动到 nidle-web 失败，请重试！\n${err.message}`)
      }
    )
  } catch (err) {
    errorLog(`nidle-spa 打包失败，请重试！\n${err.message}`)
  }
}
