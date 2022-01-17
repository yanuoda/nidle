const manifest = require('../lib')
const task = require('./fixtures/config')

manifest(task, {
  apiUrl: 'http://10.70.73.105:8086/cms/api/deploy',
  mode: 'sit',
  siteId: '5c78f07430ed58c413a517a1',
  deployId: '5d80a2c53332d076c5c62269'
})
