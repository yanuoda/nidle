const execa = require('execa')
const path = require('path')
const Logger = require('../utils/log')

/**
 * 数据库创建和迁移
 * @param {String} outPath nidle 下载目录
 */
module.exports = async function dbMigration(outPath) {
  const logger = new Logger('数据库创建及迁移')

  try {
    logger.step()
    process.chdir(path.resolve(outPath, 'nidle-web'))
    await execa('yarn', ['db:create'], { stdio: 'pipe' })
    process.chdir(process.cwd())
    logger.success()
  } catch (err) {
    logger.error(`数据库创建和迁移失败，请重试！\n${err.message}`)
  }
}
