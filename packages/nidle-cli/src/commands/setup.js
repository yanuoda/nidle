const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const semver = require('semver')

const { setupStepMessage, setupFlow, runFlow } = require('./flows')
const { rm, getGithubTags } = require('./utils')

const root = process.cwd()
let stepIndex = -1

/**
 * 安装命令
 * @param {String} output nidle 下载相对目录
 */
module.exports = async function setupCommand(output, specifyVersion) {
  const retry = !!process.env.retry
  const outPath = path.resolve(root, output || '.')
  let stepFlow = {}
  let retryFlow = null
  let setupVersion = specifyVersion

  if (retry) {
    // 断点续装需要获取中断时的上下文信息
    retryFlow = require(path.resolve(outPath, './setupContinueCtx.json'))
    console.log(chalk.yellow(`\n  开始接着上次失败处继续安装 nidle@${retryFlow.version}\n`))
    setupVersion = retryFlow.version
  } else {
    if (specifyVersion && semver.valid(specifyVersion)) {
      setupVersion = specifyVersion
    } else {
      setupVersion = await getGithubTags()
    }
    console.log(chalk.yellow(`\n  开始安装 nidle@${setupVersion}\n`))
  }

  try {
    // 收集相应信息，注入上下文变量等
    stepFlow = retry ? retryFlow : setupFlow
    stepIndex = await runFlow({
      retry,
      version: setupVersion,
      root,
      outPath,
      stepFlow,
      globalVars: { outPath, version: setupVersion }
    })

    let nidleUrl = ''
    stepFlow.steps.some(step => {
      if (step.funcName === 'customEnvConfig') {
        nidleUrl = step.res.default
        return true
      }
    })
    console.log(chalk.cyan(`  nidle 服务已启动，访问地址：${nidleUrl}\n`))
    await rm(path.resolve(outPath, './setupContinueCtx.json'))
  } catch (err) {
    stepIndex = parseInt(err.message)
    stepFlow.errorIndex = stepIndex + 1
    fs.writeFileSync(path.resolve(outPath, './setupContinueCtx.json'), JSON.stringify(stepFlow, null, 2))
    console.log(
      chalk.yellow(
        '\n  安装 nidle 失败，推荐重新运行 `nidle-cli setup --retry` 命令断点续装，或按以下步骤继续手动安装：\n'
      )
    )
    setupStepMessage.forEach((msg, index) => {
      if (index > stepIndex) {
        console.log(`    - ${msg}\n`)
      }
    })
  }
}
