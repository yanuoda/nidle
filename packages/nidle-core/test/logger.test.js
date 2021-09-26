import path from 'path'
import fs from 'fs'
const root = process.cwd()
const destination = path.resolve(root, 'test/.logger_log')
import Logger from '../lib/log/logger.js'

let log
let logFile = {}

beforeAll(() => {
  log = new Logger({
    destination,
    name: 'test'
  })

  // 创建临时日志文件
  fs.writeFileSync(path.resolve(destination, 'test.all.log'), '')
  fs.writeFileSync(path.resolve(destination, 'test.error.log'), '')

  logFile.all = fs.openSync(path.resolve(destination, 'test.all.log'))
  logFile.error = fs.openSync(path.resolve(destination, 'test.error.log'))
})

afterAll(() => {
  // 清除临时日志文件
  fs.rmSync(destination, {
    recursive: true
  })
  log.end()
})

test('log default will output all.log', async () => {
  let output
  log.logger.info('info log')
  output = await getLastLine('all')
  expect(output.indexOf('"level":30')).toBe(1)
  expect(output.indexOf('"msg":"info log"') > 0)

  log.logger.warn({ warn: 'warnning' })
  output = await getLastLine('all')

  expect(output.indexOf('"level":40')).toBe(1)
  expect(output.indexOf('"warn":"warnning"') > 0)

  output = await getLastLine('error')
  expect(output).toBeNull()
})

test('log error will output all.log and error.log', async () => {
  let output
  log.logger.error('error log')
  output = await getLastLine('all')
  expect(output.indexOf('"level":50')).toBe(1)
  expect(output.indexOf('"msg":"error log"') > 0)

  output = await getLastLine('error')
  expect(output.indexOf('"level":50')).toBe(1)
  expect(output.indexOf('"msg":"error log"') > 0)
})

test('redaction', async () => {
  let output
  log.logger.info({ password: 'test1234' })
  output = await getLastLine('all')
  expect(output.indexOf('test1234')).toBe(-1)
  expect(output.indexOf('"password":***"') > 0)

  log.logger.info({
    secret: {
      ip: '127.0.0.1'
    }
  })
  output = await getLastLine('all')
  expect(output.indexOf('127.0.0.1')).toBe(-1)
  expect(output.indexOf('127.**.**.1') > 0)

  log.logger.info({
    secret: {
      other: 'othermessage'
    }
  })
  output = await getLastLine('all')
  expect(output.indexOf('othermessage')).toBe(-1)
  expect(output.indexOf('************') > 0)
})

// 读取最后一行日志
const logPosition = {
  all: 0,
  error: 0
}

async function getLastLine(type) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fs.read(
        logFile[type],
        {
          position: logPosition[type]
        },
        function (err, bytesRead, buffer) {
          if (err) {
            reject(err)
          }

          if (bytesRead) {
            logPosition[type] += bytesRead
            resolve(buffer.toString())
          } else {
            resolve(null)
          }
        }
      )
    }, 1000)
  })
}
