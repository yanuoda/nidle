import check from './check'
import parse from './parse'
import { getGroupValues } from './value'

export default function (questions = [], readonly) {
  const { validate, message } = check(questions)

  if (!validate) {
    throw message
  }

  const columns = parse(questions, {
    readonly
  })

  return {
    layoutType: 'Form',
    columns
  }
}
export { getGroupValues }
