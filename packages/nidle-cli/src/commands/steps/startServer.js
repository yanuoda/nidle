const path = require('path')
const { Logger, runCommand } = require('../utils')

/**
 * 启动服务
 * @param {String} outPath nidle 下载目录
 */
module.exports = async function startServer(outPath) {
  const logger = new Logger('启动服务')

  try {
    process.chdir(path.resolve(outPath, 'nidle-web'))
    await runCommand('yarn', ['start'])
    process.chdir(process.cwd())
    logger.success()
  } catch (err) {
    logger.error(`服务启动失败，请重试！\n${err}`)
  }
}
