export const dictsToMap = function (dicts = []) {
  const map = {}

  dicts.forEach(item => {
    map[item.value] = item.label
  })

  return map
}
