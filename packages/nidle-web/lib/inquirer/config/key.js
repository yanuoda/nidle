const _ = require('lodash')

exports.validate = {
  parse(validator) {
    return {
      validate: validator.toString()
    }
  }
}

exports.choices = {
  parse(list) {
    _.remove(list, function (item) {
      return item.type && item.type === 'separator'
    })

    const newList = list.map(item => {
      if (typeof item === 'string' || typeof item === 'number') {
        return {
          name: item,
          value: item
        }
      }

      const newItem = {
        name: typeof item.name === 'undefined' ? item.value : item.name,
        value: typeof item.value === 'undefined' ? item.name : item.value
      }

      if (item.disabled) {
        newItem.disabled = true
      }

      return newItem
    })

    return {
      choices: newList
    }
  }
}

exports.filter = {
  disabled: true
}

exports.transformer = {
  disabled: true
}

exports.when = {
  disabled: true
}

exports.mask = {
  disabled: true
}
