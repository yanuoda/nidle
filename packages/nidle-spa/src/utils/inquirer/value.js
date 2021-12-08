import { pickBy, transform } from 'lodash'

export function getGroupValues(allValues, key) {
  const parent = key.split('.').slice(0, 2).join('.')
  const groupValues = pickBy(allValues, function (v, k) {
    return k.indexOf(parent) === 0
  })
  const values = {}
  transform(
    groupValues,
    function (result, v, k) {
      result[k.split('.').slice(2).join('.')] = v
    },
    values
  )

  return values
}
