const parsers = require('./config/key')

module.exports = function (inputs = [], values = []) {
  const groups = []
  inputs.forEach(group => {
    const { stage, step, plugin, description, input } = group
    const parent = `${stage}.${step}`
    const newGroup = {
      type: 'group',
      message: description || parent,
      __name: parent,
      __plugin: plugin
    }
    const { options = {} } =
      values.find(item => item.stage === stage && item.step === item.step && item.plugin === plugin) || {}

    newGroup.items = input.map(question => {
      return parse(
        {
          ...question,
          name: `${parent}.${question.name}`
        },
        options[question.name]
      )
    })

    groups.push(newGroup)
  })

  return groups
}

function parse(question, value) {
  const keys = Object.keys(question)
  const prop = {}

  if (typeof value !== 'undefined') {
    prop.default = value
  }

  keys.forEach(key => {
    const parser = parsers[key]

    if (!parser) {
      prop[key] = question[key]
      return
    }

    if (parser && parser.disabled) {
      return
    }

    if (!parser.parse) {
      parser.parse = function (value) {
        return {
          [parser.key]: value
        }
      }
    }

    prop[key] = parser.parse(question[key], prop)
  })

  if (typeof value !== 'undefined') {
    prop.default = value
  }

  return prop
}
