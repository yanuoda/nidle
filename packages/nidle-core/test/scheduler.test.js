import Scheduler from '../lib/scheduler/scheduler.js'
import PQueue from 'p-queue'
import { task, defaultTask, stepErrorTask, stepTimeoutErrorTask, timeoutErrorTask, retryErrorTask } from './fixtures/config.js'

test('constructor test', () => {
  const scheduler = new Scheduler({}, [1])

  expect(scheduler).toHaveProperty('task')
  expect(scheduler).toHaveProperty('logger')
  expect(scheduler).toHaveProperty('stages', [1])
  expect(scheduler).toHaveProperty('_stages', [])
  expect(scheduler).toHaveProperty('queue', null)
  expect(scheduler).toHaveProperty('_isError', false)
  expect(scheduler).toHaveProperty('EE')
})

test('mount hook', () => {
  const scheduler = new Scheduler(task(), [1])
  scheduler.mount()

  expect(scheduler.queue).toBeInstanceOf(PQueue)
})

describe('default task', () => {
  const scheduler = new Scheduler(task(), defaultTask.stages)
  
  test('mount hook', () => {
    scheduler.mount()
    expect(scheduler.queue).toBeInstanceOf(PQueue)
    expect(scheduler.queue.size).toBe(0)
    expect(scheduler.queue.pending).toBe(0)
    expect(scheduler.queue._isPaused).toBe(true)
  })

  test('task start', done => {
    scheduler.on('completed', () => {
      expect(scheduler._stages.length).toBe(0)
      expect(scheduler.queue.size).toBe(0)
      expect(scheduler.queue.pending).toBe(0)
      expect(scheduler.logger.messages).toEqual([
        { progress: 'STAGE ADD', name: 'stage1' },
        { progress: 'STAGE START', name: 'stage1' },
        { progress: 'STEP START', name: 'step1', taskName: 'step1' },
        { name: 'task success', foo: '1' },
        { progress: 'STEP COMPLETE', name: 'step1', taskName: 'step1' },
        { progress: 'STEP START', name: 'step2', taskName: 'step2.1' },
        'step2 info 1',
        'step2 warn 2',
        'step2 info 3',
        { progress: 'STEP COMPLETE', name: 'step2', taskName: 'step2.1' },
        { progress: 'STEP START', name: 'step3', taskName: 'step3' },
        'step3 info0',
        'step3 error first time',
        'step3任务第1尝试失败, 还剩2次重试.',
        'step3 info1',
        { progress: 'STEP COMPLETE', name: 'step3', taskName: 'step3' },
        { progress: 'STAGE COMPLETE', name: 'stage1' },
        { progress: 'STAGE ADD', name: 'stage2' },
        { progress: 'STAGE START', name: 'stage2' },
        { progress: 'STEP START', name: 'step5', taskName: 'step5' },
        'step5 info',
        { progress: 'STEP COMPLETE', name: 'step5', taskName: 'step5' },
        { progress: 'STAGE COMPLETE', name: 'stage2' }
      ])
      done()
    })

    scheduler.on('error', () => {
      done()
    })

    scheduler.start()
    expect(scheduler.queue._isPaused).toBe(false)
  })
})

describe('step error task', () => {
  const scheduler = new Scheduler(task(), stepErrorTask.stages)
  scheduler.mount()

  test('task run', done => {
    scheduler.on('error', error => {
      expect(scheduler._stages.length).toBe(1)
      expect(scheduler._stages[0].name).toBe('stage4 can no run')
      expect(scheduler.queue.size).toBe(0)
      expect(scheduler.queue.pending).toBe(1)
      expect(error.message).toBe('step6 error')

      done()
    })

    scheduler.start()
  })
})

describe('step timeout error task', () => {
  const scheduler = new Scheduler(task(), stepTimeoutErrorTask.stages)
  scheduler.mount()

  test('task run', done => {
    scheduler.on('error', error => {
      expect(scheduler._stages.length).toBe(0)
      expect(scheduler.queue.size).toBe(0)
      expect(scheduler.queue.pending).toBe(1)
      expect(error.message).toBe('step7任务超时: 1000')

      done()
    })

    scheduler.start()
  })
})

describe('stage timeout error task', () => {
  const scheduler = new Scheduler(task(), timeoutErrorTask.stages)
  scheduler.mount()

  test('task run', done => {
    scheduler.on('error', error => {
      expect(scheduler._stages.length).toBe(0)
      expect(scheduler.queue.size).toBe(0)
      expect(scheduler.queue.pending).toBe(1)
      expect(error.message).toBe('stage5任务超时: 1000')

      setTimeout(() => {
        done()
      }, 1000)
    })

    scheduler.start()
  })
})

describe('step retry error task', () => {
  const scheduler = new Scheduler(task(), retryErrorTask.stages)
  scheduler.mount()

  test('task run', done => {
    scheduler.on('error', error => {
      expect(scheduler._stages.length).toBe(0)
      expect(scheduler.queue.size).toBe(0)
      expect(scheduler.queue.pending).toBe(1)
      expect(scheduler.logger.messages).toContain('step9任务第1尝试失败, 还剩2次重试.')
      expect(scheduler.logger.messages).toContain('step9任务第2尝试失败, 还剩1次重试.')
      expect(scheduler.logger.messages).toContain('step9任务第3尝试失败, 还剩0次重试.')
      expect(error.message).toBe('step9 error')

      setTimeout(() => {
        done()
      }, 1000)
    })

    scheduler.start()
  })
})
