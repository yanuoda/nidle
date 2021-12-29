// stage queue
import PQueue from '@okbeng03/p-queue'
import StepQueue from './step-queue.js'
import { retryRun, timeoutRun } from './util'

class StageQueue {
  constructor() {
    this._queue = []
    this._stepQueue = null
    this._currentAddStep = null
    this._EE = null
    this._isError = false
    this.logger = null
  }

  enqueue(run, options) {
    this.task = options.task
    this.logger = options.task.logger
    this.stepEnqueue(options)
    this._queue.push({
      stage: options.stage,
      run
    })
  }

  // 添加步骤队列
  stepEnqueue(options) {
    const { steps } = options.stage
    this._EE = options.event
    this._stepQueue = new PQueue({
      concurrency: 1,
      autoStart: false,
      queueClass: StepQueue
    })

    steps.forEach(step => {
      if (step.enable === false) {
        return
      }

      this._currentAddStep = step
      step.module.apply(this)
    })

    this._bind()
  }

  _bind() {
    const EE = this._EE
    const queue = this._stepQueue
    const logger = this.logger

    queue.on('active', () => {
      const step = queue._queue.current

      logger.info({
        progress: 'STEP START',
        name: step.name,
        taskName: step.taskName
      })
    })

    queue.on('completed', () => {
      if (this._isError) {
        return
      }

      const step = queue._queue.current

      logger.info({
        progress: 'STEP COMPLETE',
        name: step.name,
        taskName: step.taskName
      })
    })

    queue.on('error', error => {
      if (this._isError) {
        return
      }
      const step = queue._queue.current

      logger.error({
        progress: 'STEP ERROR',
        name: step.name,
        taskName: step.taskName,
        error: {
          message: error.message,
          stack: error.stack
        }
      })

      // 清除运行队列
      queue.clear()
      EE.emit('error', new Error(`step ${step.name} error`))
    })

    queue.on('idle', () => {
      if (this._isError) {
        return
      }

      this._stepQueue.clear()
      this._stepQueue = null
      this._currentAddStep = null

      EE.emit('completed')
    })
  }

  // 暴露给插件的挂载钩子
  add(name, fn) {
    const { task } = this
    const step = this._currentAddStep
    step.taskName = name
    let run = () => {
      return fn(task, step.options)
    }

    if (step.retry) {
      run = retryRun.call(this, run, step)
    }

    if (step.timeout) {
      run = timeoutRun.call(this, run, step)
    }

    delete step.retry
    delete step.timeout

    this._stepQueue.add(run, step).catch(() => {
      // 如果不catch错误，在任务中throw错误会导致jest报错
      // console.error('stage error', error)
    })
  }

  dequeue() {
    const item = (this._current = this._queue.shift())
    return item.run
  }

  get size() {
    return this._queue.length
  }

  get current() {
    return this._current.stage
  }

  get child() {
    return this._stepQueue
  }

  filter(options) {
    return this._queue.filter(item => {
      return item.stage.name === options.name
    })
  }

  onFailed() {
    this._isError = true
  }
}

export default StageQueue
