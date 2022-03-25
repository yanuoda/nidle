const download = require('download')
const Logger = require('../utils/log')
const { version } = require('../utils/version')

/**
 * 下载 nidle
 * @param {String} outPath nidle 下载目录
 */
module.exports = async function downloadNidle(outPath, updateVersion) {
  const logger = new Logger('下载 nidle 安装包')

  try {
    logger.step()
    const nidleAssetsUrl = `https://github.com/hanrenguang/nidle-test/releases/download/v${
      updateVersion || version
    }/nidle.tar.gz`
    await download(nidleAssetsUrl, outPath, {
      extract: true,
      retries: 0
    })
    logger.success()
  } catch (err) {
    logger.errorLog(`下载 nidle 失败，请重试！\n${err.message}`)
  }
}
