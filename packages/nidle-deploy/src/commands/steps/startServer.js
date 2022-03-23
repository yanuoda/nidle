const path = require('path')
const execa = require('execa')
const { step, errorLog } = require('../utils/log')

/**
 * 启动服务
 * @param {String} outPath nidle 下载目录
 */
module.exports = async function startServer(outPath) {
  step('正在启动服务...')
  try {
    process.chdir(path.resolve(outPath, 'nidle-web'))
    await execa('yarn', ['start'], { stdio: 'inherit' })
  } catch (err) {
    errorLog(`服务启动失败，请重试！\n${err.message}`)
  }
}
