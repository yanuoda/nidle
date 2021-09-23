import path from 'path'
import logger from './logger.js'
const root = path.resolve(process.cwd(), 'test')

let _idx = 0

export const task = function () {
  return {
    name: 'test-app',
    repository: {},
    type: 'publish',
    log: {
      path: path.resolve(root, 'log')
    },
    output: {
      backup: {
        path: path.resolve(root, '.backup'),
        maxCount: 2
      },
      cache: {
        path: path.resolve(root, '.cache')
      },
      path: path.resolve(root, `.build/test-app.202109151400`)
    },
    input: [],
    logger: logger()
  }
}

export const defaultTask = {
  stages: [
    {
      // 正常stage
      name: 'stage1',
      timeout: 0,
      steps: [
        {
          // 正常step
          name: 'step1',
          module: {
            apply(scheduler) {
              scheduler.add('step1', (task, config) => {
                return new Promise(resolve => {
                  task.logger.info({
                    name: task.name,
                    ...config
                  })
                  resolve()
                })
              })
            }
          },
          options: {
            foo: '1'
          }
        },
        {
          // timeout、持续输出日志
          name: 'step2',
          timeout: 2000,
          module: {
            apply(scheduler) {
              scheduler.add('step2.1', task => {
                return new Promise(resolve => {
                  task.logger.info('step2 info 1')
                  task.logger.warn('step2 warn 2')
                  task.logger.info('step2 info 3')
                  resolve()
                })
              })
            }
          }
        },
        {
          // retry
          name: 'step3',
          retry: 2,
          module: {
            apply(scheduler) {
              scheduler.add('step3', task => {
                return new Promise((resolve, reject) => {
                  task.logger.info('step3 info' + _idx)

                  if (!_idx) {
                    task.logger.error('step3 error first time')
                    _idx++
                    reject(new Error('step3 error first time'))
                  }

                  resolve()
                })
              })
            }
          }
        },
        {
          // enable = false
          name: 'step4',
          enable: false,
          module: {
            apply(scheduler) {
              scheduler.add('step4', task => {
                return new Promise(resolve => {
                  task.logger.info('step4 info')
                  resolve()
                })
              })
            }
          }
        }
      ]
    },
    {
      // timeout success
      name: 'stage2',
      timeout: 3000,
      steps: [
        {
          // retry & timeout
          name: 'step5',
          retry: 2,
          timeout: 2000,
          module: {
            apply(scheduler) {
              scheduler.add('step5', task => {
                return new Promise(resolve => {
                  task.logger.info('step5 info')
                  resolve()
                })
              })
            }
          }
        }
      ]
    }
  ]
}

export const stepErrorTask = {
  stages: [
    {
      name: 'stage3',
      steps: [
        {
          // step error
          name: 'step6',
          module: {
            apply(scheduler) {
              scheduler.add('step6', task => {
                return new Promise((resolve, reject) => {
                  task.logger.info('step6 info')
                  reject(new Error('step6 error'))
                })
              })
            }
          }
        }
      ]
    },
    {
      name: 'stage4 can no run',
      steps: [
        {
          // step error
          name: 'step7',
          module: {
            apply(scheduler) {
              scheduler.add('step7', task => {
                return new Promise(resolve => {
                  task.logger.info('step7 info')
                  resolve()
                })
              })
            }
          }
        }
      ]
    }
  ]
}

export const stepTimeoutErrorTask = {
  stages: [
    {
      name: 'stage4',
      steps: [
        {
          // time out
          name: 'step7',
          timeout: 1000,
          module: {
            apply(scheduler) {
              scheduler.add('step7', task => {
                return new Promise(resolve => {
                  setTimeout(() => {
                    resolve()
                  }, 1500)
                })
              })
            }
          }
        }
      ]
    }
  ]
}

export const timeoutErrorTask = {
  stages: [
    {
      name: 'stage5',
      timeout: 1000,
      steps: [
        {
          name: 'step8',
          module: {
            apply(scheduler) {
              scheduler.add('step8', task => {
                return new Promise(resolve => {
                  setTimeout(() => {
                    task.logger.info('step8 info')
                    resolve()
                  }, 1500)
                })
              })
            }
          }
        }
      ]
    }
  ]
}

export const retryErrorTask = {
  stages: [
    {
      name: 'stage6',
      steps: [
        {
          // retry error
          name: 'step9',
          retry: 2,
          module: {
            apply(scheduler) {
              scheduler.add('step9', task => {
                return new Promise((resolve, reject) => {
                  task.logger.error('step9 error')
                  reject(new Error('step9 error'))
                })
              })
            }
          }
        }
      ]
    }
  ]
}

export const options = {
  name: 'test-app',
  repository: {
    type: 'git',
    url: 'http://xxx.xxx.com/xx/xx.git',
    branch: 'dev',
    userName: 'chb.wang'
  },
  type: 'publish',
  log: {
    path: path.resolve(root, '.log'),
    worker: {
      autoEnd: false
    }
  },
  output: {
    backup: {
      path: path.resolve(root, '.backup'),
      maxCount: 2
    },
    cache: {
      path: path.resolve(root, '.cache')
    },
    path: path.resolve(root, `.build/test-app.202109161400`)
  },
  stages: [
    {
      name: 'build',
      timeout: 0,
      steps: [
        {
          name: 'download',
          enable: true,
          path: path.resolve(root, 'fixtures/plugin-init.js'),
          options: {
            test: 'dev'
          }
        }
      ]
    }
  ],
  update (model) {
    console.log('update: ', model)
  }
}

export const retryOptions = {
  name: 'test-app',
  repository: {
    type: 'git',
    url: 'http://xxx.xxx.com/xx/xx.git',
    branch: 'dev',
    userName: 'chb.wang'
  },
  type: 'publish',
  log: {
    path: path.resolve(root, '.log'),
    worker: {
      autoEnd: false
    }
  },
  output: {
    backup: {
      path: path.resolve(root, '.backup'),
      maxCount: 2
    },
    cache: {
      path: path.resolve(root, '.cache')
    },
    path: path.resolve(root, `.build/test-app.202109181400`)
  },
  stages: [
    {
      name: 'build',
      timeout: 0,
      steps: [
        {
          name: 'download',
          enable: true,
          path: path.resolve(root, 'fixtures/plugin-init.js'),
          options: {
            test: 'dev'
          }
        }
      ]
    },
    {
      name: 'publish',
      timeout: 0,
      steps: [
        {
          name: 'publish',
          enable: true,
          path: path.resolve(root, 'fixtures/plugin-retry.js')
        }
      ]
    }
  ],
  update (model) {
    console.log('update: ', model)
  }
}
