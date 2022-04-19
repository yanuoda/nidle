const ProgressBar = require('progress')
const download = require('download')
const { Logger } = require('../utils')

function getBarInstance(showInfo) {
  let bar = { tick() {} }

  if (showInfo) {
    bar = new ProgressBar('[:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 50,
      total: 0
    })
  }
  return bar
}

/**
 * 下载 nidle
 * @param {String} outPath nidle 下载目录
 * @param {String} version 下载 nidle 版本
 */
module.exports = async function downloadNidle(outPath, version) {
  const showInfo = !!process.env.showInfo
  const logger = new Logger('下载 nidle 安装包')
  const bar = getBarInstance(showInfo)

  try {
    const nidleAssetsUrl = `https://github.com/yanuoda/nidle/releases/download/v${version}/nidle.tar.gz`
    await download(nidleAssetsUrl, outPath, {
      extract: true,
      retries: 0
    })
      .on('response', res => {
        bar.total = res.headers['content-length']
        res.on('data', data => bar.tick(data.length))
      })
      .then(() => logger.success())
  } catch (err) {
    logger.error(`下载 nidle 失败，请重试！\n${err}`)
  }
}
