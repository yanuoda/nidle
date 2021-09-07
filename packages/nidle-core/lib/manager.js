import { check, input, diff, combine } from './config/index.js'
import Scheduler from './scheduler/scheduler.js'
import logger from './log/logger.js'

// 任务管理器
class Scheduler {
  constructor (config) {
    this.config = config
    this.scheduler = null
    this.init()
  }

  // 初始化
  init () {
    const { config } = this
    // 检查配置
    const { valid, message } = check(config)

    if (!valid) {
      throw new Error(message)
    }

    // 获取inputs
    const inputs = input(config.stages)
    const lastConfig = diff(inputs, config.lastConfig)

    return {
      inputs,
      lastConfig
    }
  }

  // 挂载 - 用户确认input后
  mount (inputs) {
    const { config } = this

    this.logger = logger({
      destination: config.log.path
    })
    const stages = combine(config.stages, inputs)
    this.scheduler = new Scheduler(this, stages)
    this.scheduler.mount()
  }

  // 构建开始
  start (index = 0) {
    this.scheduler.start(index)
  }
}

export default Scheduler
