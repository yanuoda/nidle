const scp = require('../lib')
const task = require('./fixtures/config')

scp(task, {
  privacy: {
    server: [
      {
        ip: '10.70.73.105',
        output: '/frontend/y8air',
        username: 'root',
        password: 'jd@sit'
      }
    ]
  }
  // decompress: false
})
