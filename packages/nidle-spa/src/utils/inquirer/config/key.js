import parse from '../parse'

const type = {
  key: 'valueType',
  type: 'string',
  parse(value) {
    if (value === 'input') {
      return {
        valueType: 'text'
      }
    }

    if (value === 'number') {
      return {
        valueType: 'digit'
      }
    }

    if (value === 'password') {
      return {
        valueType: 'password'
      }
    }

    if (value === 'checkbox') {
      return {
        valueType: 'checkbox'
      }
    }

    if (value === 'list' || value === 'rawlist' || value === 'expand') {
      return {
        valueType: 'select'
      }
    }

    if (value === 'confirm') {
      return {
        valueType: 'switch'
      }
    }

    if (value === 'group') {
      return {
        valueType: 'group'
      }
    }
  }
}

const name = {
  key: 'dataIndex',
  type: 'string'
}

const message = {
  key: 'title',
  type: 'string|function'
}

const defaultValue = {
  key: 'initialValue',
  type: 'any'
}

const choices = {
  type: 'array|function',
  parse(list, prop) {
    list.forEach(item => {
      item.label = item.name
    })

    prop.fieldProps.options = list
  }
}

const validate = {
  type: 'function',
  parse(validator) {
    validator = eval(`(function() { return ${validator} })()`)

    return {
      validate: validator
    }
  }
}

const items = {
  type: 'array',
  parse(items) {
    return {
      columns: parse(items)
    }
  }
}

// exports.filter = {
//   key: '',
//   type: 'function'
// }

// exports.transformer = {
//   key: '',
//   type: 'function'
// }

// exports.when = {
//   key: '',
//   type: 'function|boolean'
// }

const loop = {
  key: 'loop',
  type: 'boolean'
}

export default {
  type,
  name,
  message,
  default: defaultValue,
  choices,
  validate,
  loop,
  items
}
