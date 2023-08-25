import moment from 'moment'

export const dictsToMap = function (dicts = []) {
  const map = {}

  dicts.forEach(item => {
    map[item.value] = item.label
  })

  return map
}

export const getDuration = function (time) {
  if (!time) {
    return '-'
  }

  const duration = moment.duration(time)
  const m = duration.minutes()
  const s = duration.seconds()

  return m ? `${m}m${s}s` : s === 0 ? '<1s' : `${s}s`
}
