const chalk = require('chalk')
const ora = require('ora')

module.exports = class Logger {
  constructor(stepTitle) {
    this.stepTitle = stepTitle
    this.spinner = ora({ text: stepTitle, color: 'cyan' })
  }

  step() {
    return this.spinner.start()
  }

  success() {
    return this.spinner.succeed(`${this.stepTitle}\n`)
  }

  error(msg) {
    this.spinner.fail(chalk.red(`${this.stepTitle}\n${msg}\n`))
    throw new Error('exit')
  }
}
