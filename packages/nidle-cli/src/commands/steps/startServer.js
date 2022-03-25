const path = require('path')
const execa = require('execa')
const Logger = require('../utils/log')

/**
 * 启动服务
 * @param {String} outPath nidle 下载目录
 */
module.exports = async function startServer(outPath) {
  const logger = new Logger('启动服务')

  try {
    logger.step()
    process.chdir(path.resolve(outPath, 'nidle-web'))
    await execa('yarn', ['start'], { stdio: 'pipe' })
    process.chdir(process.cwd())
    logger.success()
  } catch (err) {
    logger.errorLog(`服务启动失败，请重试！\n${err.message}`)
  }
}
