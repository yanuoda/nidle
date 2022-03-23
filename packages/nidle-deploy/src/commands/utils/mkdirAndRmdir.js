const fs = require('fs')
const rimraf = require('rimraf')
const chalk = require('chalk')
const { errorLog } = require('./log')

/**
 * 创建文件夹
 * @param {String} path dir path
 */
async function mkdir(path) {
  try {
    // 创建临时目录
    await fs.mkdir(path, () => {})
  } catch (err) {
    errorLog(`${path} 目录创建失败，请重试！\n${err.message}`)
  }
}

/**
 * 删除文件（夹）
 * @param {String} path file or dir path or glob pattern
 */
async function rm(path) {
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

module.exports = {
  mkdir,
  rm
}
