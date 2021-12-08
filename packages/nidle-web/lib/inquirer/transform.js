module.exports = function (values, groups) {
  const inputs = []

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

      options[name.split('.').slice(2).join('.')] = value
    })

    input.options = options
    inputs.push(input)
  })

  return inputs
}
