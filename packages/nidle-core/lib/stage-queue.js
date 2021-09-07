// stage queue
// stage queue item添加必须await等待上一步完成
// const PQueue = require('p-queue').default
import PQueue from 'p-queue/dist'
// const pRetry = require('p-retry')
// const pTimeout = require('p-timeout')
import StepQueue from './step-queue.js'

class StageQueue {
	constructor () {
		this._queue = []
    this._stepQueue = null
    this._currentAddStep = null
    this._EE = null
    this.logger = null
	}

	enqueue (run, options) {
    console.log('stage enqueue', options.stage.name)
    this.task = options.task
    this.logger = options.logger
    this.stepEnqueue(options)
		this._queue.push({
      stage: options.stage,
      run
    })
	}

  // 添加步骤队列
  stepEnqueue (options) {
    console.log('step queue', options.stage.name)
    const { timeout, steps } = options.stage
    this._EE = options.event
    this._stepQueue = new PQueue({
      concurrency: 1,
      autoStart: false,
      timeout: timeout || undefined,
      throwOnTimeout: true,
      queueClass: StepQueue
    })

    steps.forEach(step => {
      if (step.enable === false) {
        return
      }
      console.log('step apply', step.name)

      this._currentAddStep = step
      step.package.apply(this)
    })

    this._bind()
  }

  _bind () {
    console.log('step queue bind')
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

    queue.on('completed', result => {
      const step = queue._queue.current

      logger.info({
        progress: 'STEP COMPLETE',
        name: step.name,
        taskName: step.taskName
      })
    })

    queue.on('error', error => {
      const step = queue._queue.current

      logger.warn({
        progress: 'STEP ERROR',
        name: step.name,
        taskName: step.taskName
      })
      EE.emit('error', error)
    })

    queue.on('idle', () => {
      console.log('idle-------------')
      this._stepQueue = null
      this._currentAddStep = null

      EE.emit('completed')
    })
  }

  // 暴露给插件的挂载钩子
  add (name, fn) {
    const { task, logger, EE } = this
    const step = this._currentAddStep
    step.taskName = name
    // let run = ((task, config) => {
    //   return fn
    // })(task, step.options)
    let run = () => {
      return fn(task, step.options)
    }
    console.log('stage add step', step.name, typeof run, step.retry, step.timeout)
    // if (step.retry) {
    //   run = () => {
    //     pRetry(run, {
    //       retries: step.retry,
    //       onFailedAttempt: error => {
    //         logger.warn(`${step.name}任务第${error.attemptNumber}尝试失败, 还剩${error.retriesLeft}次重试.`)
    //       }
    //     })
    //   }
    // }

    // if (step.timeout) {
    //   run = () => {
    //     return pTimeout(run, step.timeout, () => {
    //       const message = `${step.name}任务超时: ${step.timeout}`
    //       logger.error(message)
    //       EE.emit(error, new Error(message))
    //     })
    //   }
    // }

    this._stepQueue.add(run, step)
  }

	dequeue () {
		const item = this._current = this._queue.shift()
    console.log('stage dequeue', item.stage.name)
    return item.run
	}

	get size () {
		return this._queue.length
	}

  get current () {
    return this._current.stage
  }

  get child () {
    return this._stepQueue
  }

	filter (options) {
		return this._queue.filter(item => {
      return item.stage.name === options.name
    })
	}
}

// module.exports = StageQueue
export default StageQueue
