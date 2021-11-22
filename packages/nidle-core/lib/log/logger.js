import pino from 'pino'
import redact from './redaction.js'
import transport from './transport.js'
import { mkdir } from '../backup/util'

export default class Logger {
  constructor(options) {
    mkdir(options.path)

    const transports = transport({
      worker: {
        autoEnd: false
      },
      destination: {
        all: options.all,
        error: options.error
        // pretty: path.resolve(destination, 'pretty.log')
      }
    })

    this.logger = pino(
      {
        redact
      },
      transports
    )
    this.transport = transports
  }

  end() {
    this.transport.end()
  }
}
