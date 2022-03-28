const process = require('process')
const path = require('path')
const downloadNidle = require('./steps/downloadNidle')
const customEnvConfig = require('./steps/customEnvConfig')
const { installPackages } = require('./steps/installPackages')
const dbMigration = require('./steps/dbMigration')
const startServer = require('./steps/startServer')
const buildSpa = require('./steps/buildSpa')
const { version } = require('./utils/version')
const chalk = require('chalk')

const root = process.cwd()

/**
 * 安装命令
 * @param {String} output nidle 下载相对目录
 */
module.exports = async function setupCommand(output) {
  console.log(chalk.yellow(`\n  开始安装 nidle@${version}\n`))
  const outPath = path.resolve(root, output || '.')
  // 下载 nidle
  await downloadNidle(outPath)
  // 询问 env 配置
  await customEnvConfig(outPath)
  // 下载依赖
  await installPackages(outPath)
  // 打包 nidle-spa 并将静态资源放到 nidle-web 的静态资源目录下
  await buildSpa(outPath)
  // 运行数据库生成及迁移脚本
  await dbMigration(outPath)
  // 启动服务
  await startServer(outPath)
}
