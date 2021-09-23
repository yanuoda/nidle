import path from 'path'
import pino from 'pino'
import redact from './redaction.js'
import transport from './transport.js'
import { mkdir } from '../backup/util'

export default class Logger {
  constructor(options) {
    const { destination, name } = options

    if (!destination) {
      throw new Error('options.destination must required!')
    }

    mkdir(destination)

    const transports = transport({
      worker: {
        autoEnd: false
      },
      destination: {
        all: path.resolve(destination, `${name}.all.log`),
        error: path.resolve(destination, `${name}.error.log`)
        // pretty: path.resolve(destination, 'pretty.log')
      }
    })

    this.logger = pino({
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
    this.transport = transports
  }

  end() {
    this.transport.end()
  }
}
