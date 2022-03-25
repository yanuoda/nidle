const rimraf = require('rimraf')
const chalk = require('chalk')

/**
 * 删除文件（夹）
 * @param {String} path file or dir path or glob pattern
 */
module.exports = async function rm(path) {
  try {
    await new Promise((resolve, reject) => {
      rimraf(path, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    }).catch(err => {
      throw new Error(err)
    })
  } catch (err) {
    console.log(chalk.red(`${path} 目录删除失败！`))
    console.log(chalk.red(err.message))
    console.log()
  }
}
