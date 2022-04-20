const path = require('path')
const { Logger, runCommand } = require('../utils')

module.exports = async function coverNidleFiles(oldPath, tempPath) {
  await runCommand('cp', [path.resolve(tempPath, './nidle-spa'), oldPath, '-rf']).catch(err => {
    new Logger('nidle-spa 更新文件文件拷贝').error(`nidle-spa 更新文件拷贝失败，请重试！\n${err}`)
  })
  await runCommand('cp', [path.resolve(tempPath, './nidle-web'), oldPath, '-rf']).catch(err => {
    new Logger('nidle-web 更新文件文件拷贝').error(`nidle-web 更新文件拷贝失败，请重试！\n${err}`)
  })
}
