const process = require('process')
const path = require('path')
const execa = require('execa')
const copyDir = require('../utils/copyDir')
const Logger = require('../utils/log')

/**
 * 编译打包 spa 项目，并复制到 nidle-web 的静态资源目录
 * @param {String} outPath nidle 下载目录
 */
module.exports = async function buildSpa(outPath) {
  const logger = new Logger('打包构建 nidle-spa')
  try {
    logger.step()
    process.chdir(path.resolve(outPath, 'nidle-spa'))
    await execa('yarn', ['build'], { stdio: 'pipe' })
    await copyDir(path.resolve(outPath, './nidle-spa/dist'), path.resolve(outPath, './nidle-web/app/public')).catch(
      err => {
        logger.error(`nidle-spa 静态资源移动到 nidle-web 失败，请重试！\n${err.message}`)
      }
    )
    process.chdir(process.cwd())
    logger.success()
  } catch (err) {
    logger.error(`nidle-spa 打包失败，请重试！\n${err.message}`)
  }
}
