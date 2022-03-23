const path = require('path')
const fs = require('fs')
const fsExtra = require('fs-extra')
const chalk = require('chalk')

/**
 * 检查文件路径是否存在
 * @param {String} path file path
 * @returns 文件或目录路径是否存在
 */
async function checkPath(path) {
  return new Promise(resolve => {
    fs.stat(path, (err, stat) => {
      if (err && err.code === 'ENOENT') {
        console.log(chalk.yellow(`${path} 路径不存在！`))
        resolve(false)
      } else {
        resolve(stat)
      }
    })
  })
}

/**
 * 文件或目录拷贝
 * @param {String} src copy source path
 * @param {*} target copy target path
 */
async function copy(src, target) {
  try {
    // 判断源目录/文件是否存在
    const srcStat = await checkPath(src)

    if (!srcStat) {
      throw new Error('文件或目录不存在')
    }

    await fsExtra.copy(src, target, { overwrite: true })
  } catch (err) {
    console.log(chalk.yellow(`文件拷贝失败：${src} ---> ${target}`))
  }
}

/**
 * 拷贝文件夹
 * @param {String} source source dir
 * @param {String} target target dir
 */
module.exports = async function copyDir(source, target) {
  try {
    const files = fs.readdirSync(source)
    for (const file of files) {
      await copy(path.resolve(source, file), path.resolve(target, file))
    }
  } catch (err) {
    console.log(chalk.yellow(`文件夹拷贝失败：${source} ---> ${target}\n`))
  }
}
