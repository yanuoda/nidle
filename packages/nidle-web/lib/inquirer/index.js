const _ = require('lodash')
const parse = require('./parse')
const transform = require('./transform')

exports.parse = function (inputs = [], values) {
  return parse(_.cloneDeep(inputs), values)
}

exports.transform = transform
