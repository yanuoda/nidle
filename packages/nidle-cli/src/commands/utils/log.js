const chalk = require('chalk')
const ora = require('ora')
const logSymbols = require('log-symbols')

module.exports = class Logger {
  constructor(stepTitle) {
    this.stepTitle = stepTitle
    this.showDetail = !!process.env.showInfo
    this.spinner = ora({ text: stepTitle, color: 'cyan' })
    this.start()
  }

  start() {
    if (this.showDetail) {
      console.log(chalk.cyan(`${logSymbols.info} ${this.stepTitle}`))
    } else {
      this.spinner.start()
    }
  }

  success() {
    if (this.showDetail) {
      console.log(chalk.green(`${logSymbols.success} ${this.stepTitle}成功！\n`))
    } else {
      this.spinner.succeed(`${this.stepTitle}\n`)
    }
  }

  error(msg) {
    if (this.showDetail) {
      console.log(chalk.red(`${logSymbols.error} ${this.stepTitle}\n${msg}\n`))
    } else {
      this.spinner.fail(chalk.red(`${this.stepTitle}\n${msg}\n`))
    }
    throw new Error('exit')
  }
}
