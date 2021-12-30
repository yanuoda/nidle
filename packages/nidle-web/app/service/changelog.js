'use strict'

// 发布记录
const path = require('path')
const Service = require('egg').Service
const Nidle = require('nidle')
const extend = require('extend')
const y8config = require('../mock/config/y8-config')

class ChangelogService extends Service {
  // 开始构建任务
  async start() {
    const { ctx } = this
    const config = extend(true, {}, y8config)
    const options = ctx.app.config.nidle
    const dirname = `${config.name}_${new Date().getTime()}`

    config.output.backup.path = path.resolve(options.output.backup.path, config.output.backup.path)
    config.output.path = path.resolve(options.output.path, config.output.path, dirname)
    config.source = path.resolve(options.source, config.source)
    config.log.path = path.resolve(options.log.path, config.log.path)
    config.log.all = path.resolve(options.log.path, config.log.path, `all_${dirname}.log`)
    config.log.error = path.resolve(options.log.path, config.log.path, `error_${dirname}.log`)

    try {
      const manager = new Nidle(config)
      await manager.init()
      await manager.mount([])
      await manager.start()

      manager.on('completed', () => {
        console.log('success')
      })

      manager.on('error', () => {
        console.log('error')
      })
    } catch (err) {
      console.error(11111, err)
      throw err
    }
  }
}

module.exports = ChangelogService
