const fs = require('fs')
const build = require('../lib')
const task = require('./fixtures/config')

fs.mkdirSync(task.output.path, {
  recursive: true
})

async function test() {
  try {
    await build(task, {
      output: './dist/*'
      // buildShell: './release1.sh'
    })

    // fs.rmSync(task.output.path, {
    //   recursive: true
    // })
  } catch (err) {
    console.error(err)
  }
}

test()
