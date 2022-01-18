const install = require('../lib')
const task = require('./fixtures/config')

task.process = process

install(task)
