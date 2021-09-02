const path = require('path')
const root = process.cwd()
const destination = path.resolve(root, 'test/log')
const logger = require('./logger')({
  destination
})

logger.info('info log')
logger.info('info log222')
logger.error('error log')
