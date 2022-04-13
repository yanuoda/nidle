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
  .action(async ({ output, version: specifyVersion, retry }) => {
    setup(output, specifyVersion, retry).catch(() => {})
  })

program
  .command('update')
  .option('-v, --version <version>', '指定 nidle 更新版本（如：0.1.1）')
  .option('--retry', '断点续装')
  .action(async ({ version: updateVersion, retry }) => {
    update(updateVersion, retry).catch(() => {})
  })

program.version(version).parse()
