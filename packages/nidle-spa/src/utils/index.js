import moment from 'moment'

/**
 * 获取 cookie
 * @param {String} key cookie key
 * @returns cookie value
 */
export function getCookie(key) {
  return (
    decodeURIComponent(
      document.cookie.replace(
        new RegExp(
          '(?:(?:^|.*;)\\s*' + encodeURIComponent(key).replace(/[-.+*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'
        ),
        '$1'
      )
    ) || null
  )
}

/**
 * 转换时长为 *h*m*s 格式
 * @param {Number} duration 持续时间
 */
export function transformDuration(duration) {
  if (!duration || typeof duration !== 'number') {
    return null
  }

  let res = ''
  const momentDuration = moment.duration(duration)
  const durationMethods = [
    { unit: 's', method: 'seconds' },
    { unit: 'm', method: 'minutes' },
    { unit: 'h', method: 'hours' }
  ]
  durationMethods.forEach(({ unit, method }) => {
    const time = momentDuration[method]()
    if (time > 0) {
      res = `${time}${unit}${res}`
    }
  })
  return res
}
