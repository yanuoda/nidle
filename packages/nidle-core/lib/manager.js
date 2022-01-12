import fs from 'fs'
import EventEmitter from 'eventemitter3'
import { check, input, combine } from './config/index.js'
import Scheduler from './scheduler/scheduler.js'
import Logger from './log/logger.js'
import Backup from './backup/backup.js'
import defaults from './config'

// 任务管理器
class Manager extends EventEmitter {
  constructor(config) {
    super()

    config = Object.assign({}, defaults, config)

    // 检查配置
    const { valid, message } = check(config)

    if (!valid) {
      throw new Error(message)
    }

    this.config = config
    this.scheduler = null
  }

  // 初始化
  async init() {
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
  mount(inputs, updateModel) {
    return new Promise(resolve => {
      const { config } = this

      const log = (this.log = new Logger(config.log))
      // pino transport is a async stream
      log.transport.on('ready', () => {
        resolve()
      })
      const logger = (this.logger = log.logger)
      this._backup = new Backup({
        name: config.name,
        source: config.source,
        ...config.output
      })
      const stages = combine(config.stages, inputs, config.privacy || {})
      const scheduler = (this.scheduler = new Scheduler(
        {
          name: config.name,
          repository: config.repository,
          mode: config.mode, // 环境
          type: config.type,
          processOptions: {
            execPath: process.execPath
          },
          source: config.source,
          output: {
            path: config.output.path
          },
          logger
        },
        stages
      ))
      scheduler.mount()

      async function update(model) {
        if (updateModel) {
          try {
            await updateModel(model)
          } catch (err) {
            logger.error({
              progress: 'UPDATE MODEL',
              detail: err.message
            })
          }
        }
      }

      scheduler.on('completed', async () => {
        update({
          status: 'success',
          stage: ''
        })

        logger.info({
          progress: 'SCHEDULER COMPLETE'
        })

        log.end()
        this.emit('completed')
      })

      scheduler.on('error', error => {
        update({
          status: 'fail'
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

      scheduler.on('stage.completed', () => {
        // 缓存
        // try {
        //   await backup.cache()
        // } catch (error) {
        //   logger.error({
        //     progress: 'CACHE ERROR',
        //     error: {
        //       message: error.message,
        //       stack: error.stack
        //     }
        //   })
        // }
      })
    })
  }

  // 构建开始
  async start(index = 0) {
    const { logger } = this

    if (index !== 0) {
      // 重试，需要从缓存中恢复
      // try {
      //   await this.backup.restore()

      //   logger.info({
      //     progress: 'RESTORE COMPLETE',
      //     detail: '已从缓存还原代码'
      //   })
      // } catch (error) {
      //   logger.error({
      //     progress: 'RESTORE ERROR',
      //     error: {
      //       message: error.message,
      //       stack: error.stack
      //     }
      //   })
      //   throw new Error('缓存恢复失败，请重新开始构建！')
      // }
      throw new Error('start must from index = 0!')
    }

    logger.info({
      progress: 'SCHEDULER START',
      start: index
    })
    this.scheduler.start(index)
  }

  // 清除
  clear() {
    const { config } = this

    try {
      // 删除源文件
      const sourceState = fs.statSync(config.source, {
        throwIfNoEntry: false
      })

      if (typeof sourceState !== 'undefined') {
        fs.rmSync(config.source, {
          recursive: true
        })
      }

      // 删除构建文件
      const outputState = fs.statSync(config.output.path, {
        throwIfNoEntry: false
      })

      if (typeof outputState !== 'undefined') {
        fs.rmSync(config.output.path, {
          recursive: true
        })
      }
    } catch (err) {
      throw err
    }
  }

  // 备份
  async backup() {
    try {
      await this._backup.backup()

      this.clear()
    } catch (error) {
      this.logger.error({
        progress: 'BACKUP ERROR',
        error: {
          message: error.message,
          stack: error.stack
        }
      })
      throw new Error('备份失败，请查看日志了解详情')
    }
  }

  // 回滚
  async rollback() {
    // 从备份中恢复，然后开始
    const { logger, _backup } = this

    try {
      await _backup.rollback()

      logger.info({
        progress: 'ROLLBACK COMPLETE',
        detail: '备份已还原，开始回滚'
      })

      this.start()
    } catch (error) {
      logger.error({
        progress: 'ROLLBACK ERROR',
        error: {
          message: error.message,
          stack: error.stack
        }
      })
      throw new Error('备份还原失败，请重新开始分支发布')
    }
  }
}

export default Manager
