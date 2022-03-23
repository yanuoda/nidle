#!/usr/bin/env node

const { Command } = require('commander')
const setup = require('./commands/setup')
const update = require('./commands/update')
const { version } = require('./commands/utils/version')

const program = new Command()

program
  .command('setup')
  .option('-o, --output <output>', '指定 nidle 安装包下载目录')
  .action(async ({ output }) => {
    setup(output).catch(() => {})
  })

program
  .command('update')
  .option('--update-version <version>', '指定 nidle 更新版本')
  .action(async ({ updateVersion }) => {
    update(updateVersion).catch(() => {})
  })

program.version(version).parse()

module.exports = {
  setup,
  update
}
