/**
 * 插件依赖 & 收集input
 * @param {Array} stages stage list
 * @returns {Array} inputs
 */
export default async function collect(stages) {
  const inputs = []

  // 缓存
  const pluginInputCacheMap = new Map()

  for (const stage of stages) {
    const stageName = stage.name
    for (const step of stage.steps) {
      if (step.enable) {
        const stepName = step.name
        const plugin = step.package || step.path
        const inputCache = pluginInputCacheMap.get(plugin)

        // 从缓存取
        if (inputCache) {
          inputs.push({
            stage: stageName,
            step: stepName,
            description: step.description,
            plugin,
            input: inputCache.input
          })
          step.module = new inputCache.module()
          continue
        }

        try {
          const PluginClass = (await import(plugin)).default
          const pluginInstance = (step.module = new PluginClass())
          const input = typeof pluginInstance.input === 'function' ? pluginInstance.input() : null
          if (input) {
            const inputParam = {
              stage: stageName,
              step: stepName,
              description: step.description,
              plugin,
              input
            }
            inputs.push(inputParam)
            pluginInputCacheMap.set(plugin, {
              ...inputParam,
              module: PluginClass
            })
          }
        } catch (err) {
          throw err
        }
      }
    }
  }

  pluginInputCacheMap.clear()

  return inputs
}
