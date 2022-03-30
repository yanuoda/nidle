const process = require('process')
const path = require('path')
const semver = require('semver')
const chalk = require('chalk')
const fsExtra = require('fs-extra')
const downloadNidle = require('./steps/downloadNidle')
const diffAndInquireEnvConfig = require('./steps/diffAndInquireEnvConfig')
const { installSpaPackages, installWebPackages } = require('./steps/installPackages')
const dbMigration = require('./steps/dbMigration')
const startServer = require('./steps/startServer')
const buildSpa = require('./steps/buildSpa')
const getGithubTags = require('./utils/getGithubTags')
const stopServer = require('./steps/stopServer')
const validateIfDepsUpdate = require('./utils/validateIfDepsUpdate')
const rm = require('./utils/rm')
const coverNidleFiles = require('./steps/coverNidleFiles')
const Logger = require('./utils/log')
const getCurrentVersion = require('./utils/getCurrentVersion')

const root = process.cwd()

/**
 * 更新命令
 */
module.exports = async function updateCommand(ver) {
  let updateVersion = null
  if (ver && semver.valid(ver)) {
    updateVersion = ver
  } else {
    updateVersion = await getGithubTags()
  }

  // 获取当前已安装版本
  const currentVersion = getCurrentVersion(root)

  // 判断是否是最新版/同一版本
  if (currentVersion === updateVersion) {
    console.log('当前已是最新版！\n')
    return
  }
  console.log(chalk.yellow(`\n  开始更新 nidle@${updateVersion}\n`))
  // 下载最新版 nidle
  const tempDir = path.resolve(root, 'nidle_temp')
  try {
    await fsExtra.ensureDir('nidle_temp')
  } catch (err) {
    new Logger('创建 nidle 更新文件临时目录').errorLog(err.message)
  }

  await downloadNidle(tempDir, updateVersion)

  // 先验证是否有依赖更新，如果没有，则跳过依赖下载步骤
  const isSpaDepsUpdate = await validateIfDepsUpdate(
    path.resolve(root, 'nidle-spa'),
    path.resolve(tempDir, 'nidle-spa')
  )
  const isWebDepsUpdate = await validateIfDepsUpdate(
    path.resolve(root, 'nidle-web'),
    path.resolve(tempDir, 'nidle-web')
  )
  console.log(
    chalk.yellow(
      `${
        isSpaDepsUpdate ? '  nidle-spa 依赖有变化，将会重新下载！' : '  nidle-spa 依赖无变化，将沿用之前的 node_modules'
      }\n${
        isWebDepsUpdate ? '  nidle-web 依赖有变化，将会重新下载！' : '  nidle-web 依赖无变化，将沿用之前的 node_modules'
      }\n`
    )
  )

  // 配置项 diff，并询问新增配置项
  const nidleUrl = await diffAndInquireEnvConfig(root, tempDir)
  // 停止当前服务
  await stopServer(root)
  // 先进行更新文件覆盖
  await coverNidleFiles(root, tempDir, isSpaDepsUpdate, isWebDepsUpdate)
  // 依赖有更新，则重新 install
  if (isSpaDepsUpdate) {
    await rm(path.resolve(root, './nidle-spa/node_modules'))
    await installSpaPackages(root)
  }
  if (isWebDepsUpdate) {
    await rm(path.resolve(root, './nidle-web/node_modules'))
    await installWebPackages(root)
  }

  // 打包 nidle-spa 并将静态资源放到 nidle-web 的静态资源目录下
  await buildSpa(root)
  // 运行数据库生成及迁移脚本
  await dbMigration(root)
  // 启动服务
  await startServer(root)
  // 删除临时目录
  await rm(path.resolve(root, './nidle_temp'))
  console.log(chalk.cyan(`  nidle 服务已启动，访问地址：${nidleUrl}\n`))
}
