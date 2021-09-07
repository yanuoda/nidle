const logger = {}

function log (msg) {
  console.log('logger: ', msg)
  logger.message = msg
}

const levels = [
  'trace',
  'debug',
  'info',
  'warn',
  'error',
  'fatal'
]

levels.forEach(item => {
  logger[item] = log
})

export default logger
