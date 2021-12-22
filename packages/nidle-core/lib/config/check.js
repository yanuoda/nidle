/**
 * 校验配置项
 * @param {Object} config 应用任务配置
 * @returns Object
 */
export default function check(config = {}) {
  const { name, type, repository, log, source, output, stages, update } = config

  if (!name) {
    return configErrorObj('应用名称缺失')
  }

  if (!repository || typeof repository !== 'object' || !repository.url || !repository.branch) {
    return configErrorObj('应用仓库信息缺失')
  }

  if (!log || typeof log !== 'object' || !log.path || !log.all || !log.error) {
    return configErrorObj('应用仓库日志配置缺失')
  }

  if (!stages || !Array.isArray(stages) || stages.length === 0) {
    return configErrorObj('任务流配置缺失')
  }

  if (!source) {
    return configErrorObj('源文件目录缺失')
  }

  // 发布时检查 output 选项
  if (type === 'publish') {
    if (!output || typeof output !== 'object') {
      return configErrorObj('应用输出信息缺失')
    } else if (!output.path) {
      return configErrorObj('应用输出路径缺失')
    } else if (!checkChainExist(output, 'backup.path')) {
      return configErrorObj('应用备份路径缺失')
    }
  }

  if (!update || typeof update !== 'function') {
    return configErrorObj('状态更新方法缺失')
  }

  return { valid: true, message: '' }
}

/**
 * 错误格式统一
 * @param {String} msg 错误消息
 * @returns 错误消息对象
 */
function configErrorObj(msg) {
  return { valid: false, message: `config err: ${msg}` }
}

/**
 * 检查对象是否存在相应属性链，且值不为空
 * @param {Object} source 源对象
 * @param {String} chain 属性链
 * @returns {Boolean}
 */
function checkChainExist(source, chain) {
  if (!source || typeof source !== 'object' || !chain) {
    return false
  }

  const chainPathList = chain.split('.')
  let current = source

  for (const key of chainPathList) {
    if (typeof current !== 'object' || !current[key]) {
      return false
    }

    current = current[key]
  }

  return true
}
