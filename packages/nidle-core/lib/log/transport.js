const pino = require('pino')

module.exports = (options) => {
  const targets = [
    // 错误日志
    {
      level: 'error',
      target: '#pino/file',
      options: {
        destination: options.destination.error
      }
    },
    // 所有日志
    {
      target: '#pino/file',
      options: {
        destination: options.destination.all
      }
    }
  ]

  return pino.transport({
    targets,
    worker: options.worker
  })
}
