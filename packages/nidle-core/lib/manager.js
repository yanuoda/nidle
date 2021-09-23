import path, { resolve } from 'path'
import fs from 'fs'
import EventEmitter from 'eventemitter3'
import { check, input, combine } from './config/index.js'
import Scheduler from './scheduler/scheduler.js'
import Logger from './log/logger.js'
import Backup from './backup/backup.js'

// 任务管理器
class Manager extends EventEmitter {
  constructor (config) {
    super()

    // 检查配置
    const { valid, message } = check(config)

    if (!valid) {
      throw new Error(message)
    }
  
    this.config = config
    this.update = config.update
    this.scheduler = null
  }

  // 初始化
  async init () {
    const { config } = this

    // 获取inputs
    try {
      const inputs = await input(config.stages)

      return {
        inputs
      }
    } catch (error) {
      throw error
    }
  }

  // 挂载 - 用户确认input后
  mount (inputs) {
    return new Promise(resolve => {
      const { config, update } = this
      const basename = path.basename(config.output.path)

      const log = this.log = new Logger({
        destination: config.log.path,
        name: basename
      })
      log.transport.on('ready', () => {
        resolve()
      })
      const logger = this.logger = log.logger
      const backup = this.backup = new Backup({
        name: config.name,
        ...config.output
      })
      const stages = combine(config.stages, inputs)
      const scheduler = this.scheduler = new Scheduler({
        name: config.name,
        repository: config.repository,
        type: config.type,
        output: {
          path: config.output.path
        },
        logger
      }, stages)
      scheduler.mount()

      scheduler.on('completed', async () => {
        update({
          status: 'success',
          stage: ''
        })

        logger.info({
          progress: 'SCHEDULER COMPLETE'
        })
        
        try {
          await backup.backup()
          fs.rmSync(config.output.path, {
            recursive: true
          })
        } catch (error) {
          logger.error({
            progress: 'BACKUP ERROR',
            error
          })
        }

        log.end()
        this.emit('completed')
      })

      scheduler.on('error', error => {
        update({
          status: 'error'
        })

        log.end()
        this.emit('error', error)
      })

      scheduler.on('stage.active', name => {
        // 记录运行到该stage
        update({
          stage: name
        })
      })

      scheduler.on('stage.completed', async () => {
        // 缓存
        try {
          await backup.cache()
        } catch (error) {
          logger.error({
            progress: 'CACHE ERROR',
            error
          })
        }
      })
    })
  }

  // 构建开始
  async start (index = 0) {
    const { logger } = this

    if (index !== 0) {
      // 重试，需要从缓存中恢复
      try {
        await this.backup.restore()

        logger.info({
          progress: 'RESTORE COMPLETE',
          detail: '已从缓存还原代码'
        })
      } catch (error) {
        logger.error({
          progress: 'RESTORE ERROR',
          error
        })
        throw new Error('缓存恢复失败，请重新开始构建！')
      }
    }

    logger.info({
      progress: 'SCHEDULER START',
      start: index
    })
    this.scheduler.start(index)
  }

  // 回滚
  async rollback () {
    // 从备份中恢复，然后开始
    const { logger, backup } = this
    
    try {
      await backup.rollback()

      logger.info({
        progress: 'ROLLBACK COMPLETE',
        detail: '备份已还原，开始回滚'
      })

      this.start()
    } catch (error) {
      logger.error({
        progress: 'ROLLBACK ERROR',
        error
      })
      throw new Error('备份还原失败，请重新开始分支发布')
    }
  }
}

export default Manager
