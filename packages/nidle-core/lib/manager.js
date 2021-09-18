import EventEmitter from 'eventemitter3'
import { check, input, combine } from './config/index.js'
import Scheduler from './scheduler/scheduler.js'
import logger from './log/logger.js'
import Backup from './backup/backup.js'

// 任务管理器
class Manager extends EventEmitter {
  constructor(config) {
    this.config = config
    this.scheduler = null
  }

  // 初始化
  init() {
    const { config } = this
    // 检查配置
    const { valid, message } = check(config)

    if (!valid) {
      throw new Error(message)
    }

    // 获取inputs
    const inputs = input(config.stages)

    return {
      inputs
    }
  }

  // 挂载 - 用户确认input后
  mount(inputs) {
    const { config } = this

    const log = (this.logger = logger({
      destination: config.log.path
    }))
    const backup = (this.backup = new Backup({
      name: config.name,
      ...config.output
    }))
    const stages = combine(config.stages, inputs)
    this.scheduler = new Scheduler(this, stages)
    this.scheduler.mount()

    this.scheduler.on('completed', async () => {
      // TODO: 状态

      log.info({
        progress: 'SCHEDULER COMPLETE'
      })

      try {
        await backup.backup()
      } catch (error) {
        log.error({
          progress: 'BACKUP ERROR',
          error
        })
      }

      this.emit('completed')
    })

    this.scheduler.on('error', error => {
      this.emit('error', error)
    })
  }

  // 构建开始
  start(index = 0) {
    const { logger: log } = this

    if (index !== 0) {
      // 重试，需要从缓存中恢复
      try {
        this.backup.restore()
      } catch (error) {
        log.error({
          progress: 'RESTORE ERROR',
          error
        })
        throw new Error('缓存恢复失败，请重新开始构建！')
      }
    }

    log.info({
      progress: 'SCHEDULER START',
      start: index
    })
    this.scheduler.start(index)
  }

  // 回滚
  rollback() {}
}

export default Manager
