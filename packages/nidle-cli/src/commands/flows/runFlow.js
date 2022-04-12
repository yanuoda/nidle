const steps = require('../steps')
const helper = require('../helper')

module.exports = async function runFlow(options = {}) {
  const { retry, stepFlow, version, root, outPath, globalVars } = options
  let stepIndex = -1
  let errorIndex = -1

  if (retry) {
    errorIndex = stepFlow.errorIndex
  }

  stepFlow.version = version
  stepFlow.root = root
  stepFlow.outPath = outPath

  const { steps: flowSteps } = stepFlow
  const stepMap = {}
  flowSteps.forEach(({ funcName }, index) => (stepMap[funcName] = index))

  // 解析参数字符串并返回参数数组
  const parseArgs = args => {
    return args.map(arg => {
      const [func, returnKey] = arg.split('.')
      const funcIndex = stepMap[func]
      return func === 'globalVars' ? globalVars[returnKey] : flowSteps[funcIndex].res[returnKey]
    })
  }

  try {
    for (const [index, step] of flowSteps.entries()) {
      // 执行所有未执行步骤
      if (index >= errorIndex) {
        const { args, funcName, clearFunc } = step
        if (retry && clearFunc) {
          // 如果是断点续装，则需要做一些清理工作
          const [clearFuncName, ...rest] = clearFunc
          await helper[clearFuncName](...parseArgs(rest))
        }
        const stepArgs = parseArgs(args)
        const res = await steps[funcName](...stepArgs)
        step.res = typeof res === 'object' ? res : { default: res }
      }
      stepIndex++
    }
  } catch (err) {
    throw new Error(stepIndex)
  }

  return stepIndex
}
