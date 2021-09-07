/**
 * 插件依赖 & 收集input
 * @param {Array} stages stage list
 * @returns {Array} inputs 
 */
export default function collect (stages) {
  const inputs = []

  // 这里最好有个数组来缓存插件，如果已经依赖过了，就直接获取input就好了

  stages.forEach(stage => {
    stage.steps.forEach(step => {
      // 插件依赖
      // const Plugin = require(step.package)

      // new Plugin
      // const plugin = new Plugin()

      // plugin.input()
      // const input = plugin.input()
      // inputs.push({
      //   stage: stage.name,
      //   plugin: step.name,
      //   options: input
      // })
    })
  })

  return inputs
}
