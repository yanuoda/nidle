import types from './config/type'
import props from './config/props'

export default function (questions = []) {
  const len = questions.length
  let validate = true
  let msg = ''

  for (let i = 0; i < len; i++) {
    const question = questions[i]
    const type = question.type

    if (typeof type === 'undefined') {
      validate = false
      msg = `index ${i}:: type is not defined`
      break
    }

    if (types.findIndex(item => item === type) < 0) {
      validate = false
      msg = `index ${i}:: type ${type} is not supported`
      break
    }

    const message = check(question, props[type])

    if (message) {
      validate = false
      msg = `index ${i}:: ${message}`
      break
    }
  }

  return {
    validate,
    message: msg
  }
}

function check(obj, prop) {
  const keys = Object.keys(obj)
  const { required } = prop
  const diffs = []

  required.forEach(item => {
    if (keys.findIndex(key => key === item) < 0) {
      diffs.push(item)
    }
  })

  if (diffs.length) {
    return `${diffs.join(', ')} keys is required`
  }
}
