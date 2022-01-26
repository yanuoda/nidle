import parsers from './config/key'

export default function (questions = [], props) {
  return questions.map(question => {
    return parse(question, props)
  })
}

function parse(question, props) {
  const keys = Object.keys(question)
  const rules = []

  if (question.required !== false) {
    rules.push({
      required: true,
      message: '此项为必填项'
    })
  }

  const prop = {
    ...props,
    formItemProps: {
      rules
    },
    fieldProps: {}
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

    const option = parser.parse(question[key], prop)
    Object.assign(prop, option)
  })

  return prop
}
