module.exports = {
  paths: ['password', 'secret.*'],
  censor: (value, path) => {
    if (path === 'password') {
      return new Array(Math.round(Math.random() * 10)).fill('*').join('')
    }

    if (path.indexOf('secret') === 0) {
      const key = path[1]

      if (key === 'ip') {
        return value.replace(/^(\d+\.).*(\.\d)$/, '$1**.**$2')
      }
      // if (key === 'path') {
      //   // return 
      // }

      return value.replace(/./g, '*')
    }
    // TODO: 脱敏这里可能还有问题，因为固定格式需要shell output做特殊处理
    // return value.replace(/./g, '*')
  }
}
