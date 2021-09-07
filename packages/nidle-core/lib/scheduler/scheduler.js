import PQueue from 'p-queue/dist'
import StageQueue from './stage-queue.js'
import EventEmitter from 'eventemitter3'

// 插件挂载处理
class Mounter extends EventEmitter {
  constructor (task, stages) {
    super()

    this.task = task
    this.logger = task.logger
    this.stages = stages
    this._stages = []
    this.queue = null
    this._isError = false
    this.EE = new EventEmitter()
  }

  mount () {
    this.queue = new PQueue({
      concurrency: 1,
      autoStart: false,
      queueClass: StageQueue
    })

    this._bind()
  }

  _bind () {
    const { queue, logger, _stages } = this

    queue.on('active', () => {
      const stage = queue._queue.current
      logger.info({
        progress: 'STAGE START',
        name: stage.name
      })

      // TODO: 状态
    })

    queue.on('completed', () => {
      const stage = queue._queue.current
      logger.info({
        progress: 'STAGE COMPLETE',
        name: stage.name
      })

      // TODO: 备份、状态等操作
      // TODO: stage complete

      if (_stages.length) {
        this._add()
      } else {
        this.emit('completed')
      }
    })

    queue.on('error', error => {
      const stage = queue._queue.current
      logger.warn({
        progress: 'STAGE ERROR',
        name: stage.name,
        error
      })

      this._isError = true

      // 清除运行队列
      queue._queue.child.clear()
      queue.clear()

      // TODO: 状态
    })
  }

  _add () {
    const { task, _stages, queue, _isError, EE, logger } = this

    if (_isError) {
      return false
    }

    const stage = _stages.shift()
    queue.add(() => {
      return new Promise((resolve, reject) => {
        console.log('stage run', stage.name)
        // 阶段步骤开始
        queue._queue.child.start()

        EE.on('error', error => {
          reject(err)
        })

        EE.on('completed', () => {
          resolve()
        })
      })
    }, {
      task,
      stage,
      event: EE,
      logger
    })
  }

  // 指定开始步骤
  start (start = 0) {
    console.log('start')
    this._stages = this.stages.slice(start)
    this._add()
    this.queue.start()
  }
}

export default Mounter
