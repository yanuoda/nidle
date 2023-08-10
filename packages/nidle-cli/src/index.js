#!/usr/bin/env node

const { Command } = require('commander')
const setup = require('./commands/setup')
const update = require('./commands/update')
const { version } = require('./commands/utils')

const program = new Command()

program
  .command('setup')
  .option('-o, --output <output>', '指定 nidle 安装包下载目录')
  .option('-v, --version <version>', '指定 nidle 安装版本（如：0.1.1）')
  .option('--retry', '断点续装')
  .option('--showinfo', '显示命令执行过程中的所有信息')
  .action(async ({ output, version: specifyVersion, retry, showinfo }) => {
    process.env.retry = retry ? 'retry' : ''
    process.env.showInfo = showinfo ? 'showinfo' : ''
    setup(output, specifyVersion).catch(() => {})
  })

program
  .command('update')
  .option('-v, --version <version>', '指定 nidle 更新版本（如：0.1.1）')
  .option('--retry', '断点续装')
  .option('--showinfo', '显示命令执行过程中的所有信息')
  .action(async ({ version: updateVersion, retry, showinfo }) => {
    process.env.retry = retry ? 'retry' : ''
    process.env.showInfo = showinfo ? 'showinfo' : ''
    update(updateVersion).catch(() => {})
  })

program.version(version).parse()
