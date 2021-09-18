import path from 'path'
import pino from 'pino'
import redact from './redaction.js'
import transport from './transport.js'

export default function (options) {
  const { destination } = options

  if (!destination) {
    throw new Error('options.destination must required!')
  }

  const transports = transport({
    worker: options.worker || {},
    destination: {
      all: path.resolve(destination, 'all.log'),
      error: path.resolve(destination, 'error.log')
      // pretty: path.resolve(destination, 'pretty.log')
    }
  })

  const logger = pino(
    {
      redact
      // base: undefined
      // formatters: {
      //   level (label, number) {
      //     return {
      //       level: number,
      //       levelLabel: label
      //     }
      //   }
      // }
    },
    transports
  )

  return {
    logger,
    transport: transports
  }
}
