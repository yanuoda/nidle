const process = require('process')
const path = require('path')
const semver = require('semver')
const chalk = require('chalk')
const fsExtra = require('fs-extra')
const fs = require('fs')

const { getGithubTags, rm, Logger, getCurrentVersion } = require('./utils')
const { updateStepMessage, updateFlow, runFlow } = require('./flows')

const root = process.cwd()

/**
 * 更新命令
 */
module.exports = async function updateCommand(ver, retry) {
  let updateVersion = null
  let retryFlow = null
  if (retry) {
    // 断点续装需要获取中断时的上下文信息
    retryFlow = require(path.resolve(root, './updateContinueCtx.json'))
    updateVersion = retryFlow.version
  } else if (ver && semver.valid(ver)) {
    updateVersion = ver
  } else {
    updateVersion = await getGithubTags()
  }

  if (!retry) {
    // 获取当前已安装版本
    const currentVersion = getCurrentVersion(root)

    // 判断是否是最新版/同一版本
    if (currentVersion === updateVersion) {
      console.log('当前已是最新版！\n')
      return
    }
    console.log(chalk.yellow(`\n  开始更新 nidle@${updateVersion}\n`))
  } else {
    // 从中断处继续更新
    console.log(chalk.yellow(`\n  开始接着上次失败处继续更新 nidle@${retryFlow.version}\n`))
  }

  // 下载新版 nidle
  const tempDir = path.resolve(root, 'nidle_temp')
  try {
    await fsExtra.ensureDir('nidle_temp')
  } catch (err) {
    new Logger('创建 nidle 更新文件临时目录').error(err.message)
  }

  let stepFlow = null
  let stepIndex = -1
  try {
    // 收集相应信息，注入上下文变量等
    stepFlow = retry ? retryFlow : updateFlow
    stepIndex = await runFlow({
      retry,
      version: updateVersion,
      root,
      outPath: root,
      stepFlow,
      globalVars: { root, tempDir, version: updateVersion }
    })

    let nidleUrl = ''
    stepFlow.steps.some(step => {
      if (step.funcName === 'diffAndInquireEnvConfig') {
        nidleUrl = step.res.default
        return true
      }
    })
    console.log(chalk.cyan(`  nidle 服务已启动，访问地址：${nidleUrl}\n`))
    await rm(path.resolve(root, './updateContinueCtx.json'))
    // 删除临时目录
    await rm(path.resolve(root, './nidle_temp'))
  } catch (err) {
    stepIndex = parseInt(err.message)
    stepFlow.errorIndex = stepIndex + 1
    fs.writeFileSync(path.resolve(root, './updateContinueCtx.json'), JSON.stringify(stepFlow, null, 2))
    console.log(
      chalk.yellow(
        '\n  更新 nidle 失败，推荐重新运行 `nidle-cli update --retry` 命令断点续装，或按以下步骤继续手动更新：\n'
      )
    )
    updateStepMessage.forEach((msg, index) => {
      if (index > stepIndex) {
        console.log(`    - ${msg}\n`)
      }
    })
  }
}
