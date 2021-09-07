/**
 * 校验配置项
 * @param {Object} config 应用任务配置
 * @returns Object
 */
export default function check (config) {
  return {
    valid: true,
    message: '' // 失败时返回原因
  }
}
