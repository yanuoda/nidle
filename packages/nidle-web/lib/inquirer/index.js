const _ = require('lodash')
const parse = require('./parse')
const transform = require('./transform')

exports.parse = function (inputs = []) {
  return parse(_.cloneDeep(inputs))
}

exports.transform = transform
