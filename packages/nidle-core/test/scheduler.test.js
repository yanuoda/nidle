import Mounter from '../lib/scheduler/scheduler.js'
import PQueue from 'p-queue/dist'
import { task, defaultTask, stepErrorTask, stepTimeoutErrorTask, timeoutErrorTask, retryErrorTask } from './fixtures/config.js'

test('constructor test', () => {
  const scheduler = new Mounter({}, [1])

  expect(scheduler).toHaveProperty('task')
  expect(scheduler).toHaveProperty('logger')
  expect(scheduler).toHaveProperty('stages', [1])
  expect(scheduler).toHaveProperty('_stages', [])
  expect(scheduler).toHaveProperty('queue', null)
  expect(scheduler).toHaveProperty('_isError', false)
  expect(scheduler).toHaveProperty('EE')
})

test('mount hook', () => {
  const scheduler = new Mounter(task, [1])
  scheduler.mount()

  expect(scheduler.queue).toBeInstanceOf(PQueue)
})

describe('default task', () => {
  const scheduler = new Mounter(task, defaultTask.stages)
  
  test('mount hook', () => {
    scheduler.mount()
    // expect(scheduler.queue).toBeInstanceOf(PQueue)
    expect(scheduler.queue.size).toBe(0)
    expect(scheduler.queue.pending).toBe(0)
    expect(scheduler.queue._isPaused).toBe(true)
  })

  test('task start', done => {
    scheduler.queue.on('add', () => {
      expect(scheduler._stages.length).toBe(1)
      expect(scheduler.queue.size).toBe(1)
      expect(scheduler.queue.pending).toBe(0)

      done()
    })

    scheduler.start()
    expect(scheduler.queue._isPaused).toBe(false)
  })
})
