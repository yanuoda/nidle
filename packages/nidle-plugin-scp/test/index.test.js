const scp = require('../lib')
const task = require('./fixtures/config')

scp(task, {
  servers: [
    {
      ip: '10.70.73.105',
      output: '/frontend/y8air',
      username: 'root',
      password: 'jd@sit'
    }
  ]
  // decompress: false
})
