const path = require('path')
const execa = require('execa')
const { step, errorLog } = require('./log')

/**
 * 启动服务
 * @param {String} outPath nidle 下载目录
 */
module.exports = async function startServer(outPath) {
  step('正在停止服务...')
  try {
    process.chdir(path.resolve(outPath, 'nidle-web'))
    await execa('yarn', ['stop'], { stdio: 'inherit' })
    process.chdir(outPath)
  } catch (err) {
    errorLog(`服务停止失败，请重试！\n${err.message}`)
  }
}
