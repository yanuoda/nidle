module.exports = function (values, groups, notTransform) {
  const inputs = []

  if (!notTransform) {
    groups.forEach(group => {
      const { __name, __plugin } = group
      const [stageName, stepName] = __name.split('.')
      const input = {
        stage: stageName,
        step: stepName,
        plugin: __plugin
      }
      const options = {}

      group.items.forEach(item => {
        const { name } = item
        const value = values[name]
        const key = name.split('.').slice(2).join('.')

        // 添加标识，更容易去映射服务信息
        if (item.type === 'servers') {
          input._serversKey = key
        }

        options[key] = value
      })

      input.options = options
      inputs.push(input)
    })
  } else {
    groups.forEach(group => {
      const input = values.find(
        item => item.stage === group.stage && item.step === group.step && item.plugin === group.plugin
      )

      if (input) {
        group.input.forEach(item => {
          if (item.type === 'servers') {
            input._serversKey = item.name
          }
        })

        inputs.push(input)
      }
    })
  }

  return inputs
}
