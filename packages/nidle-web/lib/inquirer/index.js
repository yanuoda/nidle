const parse = require('./parse')

module.exports = function (questions = []) {
  return parse(questions)
}
