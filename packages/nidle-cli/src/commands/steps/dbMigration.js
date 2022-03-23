const execa = require('execa')
const path = require('path')
const { step, errorLog } = require('../utils/log')

/**
 * 数据库创建和迁移
 * @param {String} outPath nidle 下载目录
 */
module.exports = async function dbMigration(outPath) {
  step('开始数据库创建及迁移操作...')
  try {
    process.chdir(path.resolve(outPath, 'nidle-web'))
    await execa('yarn', ['db:create'], { stdio: 'inherit' })
  } catch (err) {
    errorLog(`数据库创建和迁移失败，请重试！\n${err.message}`)
  }
}
