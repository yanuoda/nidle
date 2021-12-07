import parsers from './config/key'

export default function (questions = []) {
  return questions.map(question => {
    return parse(question)
  })
}

function parse(question) {
  const keys = Object.keys(question)
  const prop = {
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项'
        }
      ]
    },
    fieldProps: {},
    initialValues: {}
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
