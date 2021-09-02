const pino = require('pino')

module.exports = (options) => {
  return pino.transport({
    targets: [
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
      },
      // 格式化后的日志
      // {
      //   target: '#pino/pretty',
      //   options: {
      //     destination: options.destination.pretty
      //   }
      // }
      // TODO: socket
    ],
    worker: options.worker
  })
}
