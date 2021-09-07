const logger = {
  messages: []
}

function log (msg) {
  console.log('logger: ', msg)
  logger.message = msg
  logger.messages.push(msg)
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
