const chalk = require('chalk')

const step = msg => console.log(chalk.green(`${msg}\n`))

const errorLog = msg => {
  console.log(chalk.red(`${msg}\n`))
  throw new Error('exit')
}

module.exports = {
  step,
  errorLog
}
