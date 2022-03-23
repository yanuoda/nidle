const ProgressBar = require('progress')
const download = require('download')
const { step, errorLog } = require('../utils/log')
const { version } = require('../utils/version')

const bar = new ProgressBar('[:bar] :percent :etas', {
  complete: '=',
  incomplete: ' ',
  width: 50,
  total: 0
})

/**
 * 下载 nidle
 * @param {String} outPath nidle 下载目录
 */
module.exports = async function downloadNidle(outPath, updateVersion) {
  try {
    step('开始下载 nidle...')
    const nidleAssetsUrl = `https://github.com/hanrenguang/nidle-test/releases/download/v${
      updateVersion || version
    }/nidle.tar.gz`
    console.log(nidleAssetsUrl)
    await download(nidleAssetsUrl, outPath, {
      extract: true,
      retries: 0
    })
      .on('response', res => {
        bar.total = res.headers['content-length']
        res.on('data', data => bar.tick(data.length))
      })
      .then(() => step('下载 nidle 成功！'))
  } catch (err) {
    errorLog(`下载 nidle 失败，请重试！\n${err.message}`)
  }
}
