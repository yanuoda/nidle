const imagemin = require('../lib/index')
const task = require('./fixtures/config')

imagemin(task, {
  source: 'imgage,img'
})
