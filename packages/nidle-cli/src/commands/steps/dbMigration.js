const path = require('path')
const { Logger, runCommand } = require('../utils')

/**
 * 数据库创建和迁移
 * @param {String} outPath nidle 下载目录
 */
module.exports = async function dbMigration(outPath) {
  const logger = new Logger('数据库创建及迁移')

  try {
    process.chdir(path.resolve(outPath, 'nidle-web'))
    await runCommand('yarn', ['db:create'])
    process.chdir(process.cwd())
    logger.success()
  } catch (err) {
    logger.error(`数据库创建和迁移失败，请重试！\n${err}`)
  }
}
