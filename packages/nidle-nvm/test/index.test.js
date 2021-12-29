const nvm = require('../lib')
const task = require('./fixtures/config')

nvm(task)
  .then(() => {
    console.log(task.processOptions)
  })
  .catch(err => {
    console.error(err)
  })
