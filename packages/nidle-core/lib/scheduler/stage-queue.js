// stage queue
import PQueue from 'p-queue'
import pRetry from 'p-retry'
import pTimeout from 'p-timeout'
import StepQueue from './step-queue.js'

class StageQueue {
	constructor () {
		this._queue = []
    this._stepQueue = null
    this._currentAddStep = null
    this._EE = null
    this._isError = false
    this.logger = null
	}

	enqueue (run, options) {
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
    const {  steps } = options.stage
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
      step.package.apply(this)
    })

    this._bind()
  }

  _bind () {
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
        error
      })
      EE.emit('error', error)
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
  add (name, fn) {
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

    this._stepQueue.add(run, step).catch(error => {
      // 如果不catch错误，在任务中throw错误会导致jest报错
      console.error('stage error', error)
    })
  }

	dequeue () {
		const item = this._current = this._queue.shift()
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

  onFailed () {
    this._isError = true
  }
}

function retryRun (run, step) {
  return () => {
    return pRetry(run, {
      retries: step.retry,
      onFailedAttempt: error => {
        this.logger.warn(`${step.name}任务第${error.attemptNumber}尝试失败, 还剩${error.retriesLeft}次重试.`)
        return
      }
    })
  }
}

function timeoutRun (run, step) {
  return () => {
    return pTimeout(run(), step.timeout, () => {
      throw new Error(`${step.name}任务超时: ${step.timeout}`)
    })
  }
}

export default StageQueue
