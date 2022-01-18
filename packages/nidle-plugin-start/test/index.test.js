const start = require('../lib')
const task = require('./fixtures/config')

start(task, {
  shellFile: 'start.sit.sh'
})
