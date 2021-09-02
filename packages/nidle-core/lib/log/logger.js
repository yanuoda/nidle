const path = require('path')
const pino = require('pino')
const redact = require('./redaction')
const transport = require('./transport')

module.exports = function (options) {
  const { destination } = options
  const transports = transport({
    worker: options.worker || {},
    destination: {
      all: path.resolve(destination, 'all.log'),
      error: path.resolve(destination, 'error.log'),
      pretty: path.resolve(destination, 'pretty.log')
    }
  })

  const logger = pino({
    redact,
    // base: undefined
    // formatters: {
    //   level (label, number) {
    //     return {
    //       level: number,
    //       levelLabel: label
    //     }
    //   }
    // }
  }, transports)

  return {
    logger,
    transport: transports
  }
}
