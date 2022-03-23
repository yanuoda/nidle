const process = require('process')
const path = require('path')
const semver = require('semver')
const downloadNidle = require('./utils/downloadNidle')
// const customEnvConfig = require('./utils/customEnvConfig')
const { installSpaPackages, installWebPackages } = require('./utils/installPackages')
const dbMigration = require('./utils/dbMigration')
const startServer = require('./utils/startServer')
const buildSpa = require('./utils/buildSpa')
const getGithubTags = require('./utils/getGithubTags')
const stopServer = require('./utils/stopServer')
const validateIfDepsUpdate = require('./utils/validateIfDepsUpdate')
const { mkdir, rm } = require('./utils/mkdirAndRmdir')
const coverNidleFiles = require('./utils/coverNidleFiles')
const chalk = require('chalk')

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
  // 下载最新版 nidle
  const tempDir = path.resolve(root, 'nidle_temp')
  await mkdir('nidle_temp')
  await downloadNidle(tempDir, updateVersion)

  /** 下载依赖 **/
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
        isSpaDepsUpdate ? 'nidle-spa 依赖有变化，将会重新下载！' : 'nidle-spa 依赖无变化，将沿用之前的 node_modules'
      }\n${
        isWebDepsUpdate ? 'nidle-web 依赖有变化，将会重新下载！' : 'nidle-web 依赖无变化，将沿用之前的 node_modules'
      }\n`
    )
  )
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

  // 询问 env 配置
  // await customEnvConfig(root)
  // 打包 nidle-spa 并将静态资源放到 nidle-web 的静态资源目录下
  await buildSpa(root)
  // 运行数据库生成及迁移脚本
  await dbMigration(root)
  // 启动服务
  await startServer(root)
  // 删除临时目录
  await rm(path.resolve(root, './nidle_temp'))
}