import pino from 'pino'

export default options => {
  const targets = [
    // 错误日志
    {
      level: 'error',
      target: 'pino/file',
      options: {
        destination: options.destination.error,
        sync: false
      }
    },
    // 所有日志
    {
      target: 'pino/file',
      options: {
        destination: options.destination.all,
        sync: false
      }
    }
  ]

  return pino.transport({
    targets,
    worker: options.worker
  })
}
