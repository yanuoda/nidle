import check from './check'
import parse from './parse'

export default function (questions = []) {
  const { validate, message } = check(questions)

  if (!validate) {
    throw message
  }

  const columns = parse(questions)

  return {
    layoutType: 'Form',
    columns
  }
}
