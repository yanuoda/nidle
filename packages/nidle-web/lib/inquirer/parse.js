const parsers = require('./config/key')

module.exports = function (inputs = []) {
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

    newGroup.items = input.map(question => {
      question.name = `${parent}.${question.name}`

      return parse(question)
    })

    groups.push(newGroup)
  })

  return groups
}

function parse(question) {
  const keys = Object.keys(question)
  const prop = {}

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

    const option = parser.parse(question[key], prop)
    Object.assign(prop, option)
  })

  return prop
}
