import path from 'path'
import { fileURLToPath } from 'url'
import { check, input, combine } from '../lib/config/index.js'

const __filename = fileURLToPath(import.meta.url)

// check
test('check config', () => {
  const config = {}

  expect(check(config)).toEqual({ valid: false, message: 'config err: 应用名称缺失' })
  config.name = 'test'
  expect(check(config)).toEqual({ valid: false, message: 'config err: 应用仓库信息缺失' })
  config.repository = { url: 'https://test.url', branch: 'dev' }
  expect(check(config)).toEqual({ valid: false, message: 'config err: 应用仓库日志配置缺失' })
  config.log = { path: '/log/path' }
  expect(check(config)).toEqual({ valid: false, message: 'config err: 任务流配置缺失' })
  config.stages = {}
  expect(check(config)).toEqual({ valid: false, message: 'config err: 任务流配置缺失' })
  config.stages = [{}]
  expect(check(config)).toEqual({ valid: false, message: 'config err: 状态更新方法缺失' })
  config.update = function () {}
  expect(check(config)).toEqual({ valid: true, message: '' })
  config.type = 'publish'
  expect(check(config)).toEqual({ valid: false, message: 'config err: 应用输出信息缺失' })
  config.output = {}
  expect(check(config)).toEqual({ valid: false, message: 'config err: 应用输出路径缺失' })
  config.output.path = '/out/path'
  expect(check(config)).toEqual({ valid: false, message: 'config err: 应用缓存路径缺失' })
  config.output.cache = { path: '/cache/path' }
  expect(check(config)).toEqual({ valid: true, message: '' })
})

// combine
test('combine inputs', () => {
  const inputs = [{
    stage: 'stage1',
    plugin: 'wrongName',
    options: {
      input1: 'input1'
    }
  }]
  const stages = [
    {
      name: 'stage1',
      steps: [
        {
          enable: true,
          name: 'plugin1',
          package: 'plugin1',
          options: {
            input1: 'default'
          }
        }
      ]
    }
  ]

  expect(combine(stages, inputs)).toEqual(stages)
  inputs[0].plugin = 'plugin1'
  expect(combine(stages, inputs)).toEqual([
    {
      name: 'stage1',
      steps: [
        {
          enable: true,
          name: 'plugin1',
          package: 'plugin1',
          options: {
            input1: 'input1'
          }
        }
      ]
    }
  ])
})
