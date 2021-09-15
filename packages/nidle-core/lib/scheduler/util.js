import pRetry from 'p-retry'
import pTimeout from 'p-timeout'

export const retryRun = function (run, task) {
  return () => {
    return pRetry(run, {
      retries: task.retry,
      onFailedAttempt: error => {
        this.logger.warn(`${task.name}任务第${error.attemptNumber}尝试失败, 还剩${error.retriesLeft}次重试.`)
        return
      }
    })
  }
}

export const timeoutRun = function (run, task) {
  return () => {
    return pTimeout(run(), task.timeout, () => {
      throw new Error(`${task.name}任务超时: ${task.timeout}`)
    })
  }
}
