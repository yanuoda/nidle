// import path from 'path'
// import { fileURLToPath } from 'url'
import { check, combine } from '../lib/config/index.js'

// check
test('check config', () => {
  const config = {}

  expect(check(config)).toEqual({ valid: false, message: 'config err: 应用名称缺失' })
  config.name = 'test'
  expect(check(config)).toEqual({ valid: false, message: 'config err: 应用仓库信息缺失' })
  config.repository = { url: 'https://test.url', branch: 'dev' }
  expect(check(config)).toEqual({ valid: false, message: 'config err: 应用仓库日志配置缺失' })
  config.log = { path: '/log/path', all: '/log/path/all.log', error: '/log/path/error.log' }
  expect(check(config)).toEqual({ valid: false, message: 'config err: 任务流配置缺失' })
  config.stages = {}
  expect(check(config)).toEqual({ valid: false, message: 'config err: 任务流配置缺失' })
  config.stages = [{}]
  expect(check(config)).toEqual({ valid: false, message: 'config err: 源文件目录缺失' })
  config.source = '/source/'
  expect(check(config)).toEqual({ valid: false, message: 'config err: 状态更新方法缺失' })
  config.update = function () {}
  expect(check(config)).toEqual({ valid: true, message: '' })
  config.type = 'publish'
  expect(check(config)).toEqual({ valid: false, message: 'config err: 应用输出信息缺失' })
  config.output = {}
  expect(check(config)).toEqual({ valid: false, message: 'config err: 应用输出路径缺失' })
  config.output.path = '/out/path'
  expect(check(config)).toEqual({ valid: false, message: 'config err: 应用备份路径缺失' })
  config.output.backup = { path: '/backup/path' }
  expect(check(config)).toEqual({ valid: true, message: '' })
})

// input
// jest 动态依赖在两个测试文件中会报错
// `You are trying to `import` a file after the Jest environment has been torn down`
// test('plugin inputs', async () => {
//   const stages = [
//     {
//       name: 'stage1',
//       steps: [
//         {
//           enable: false,
//           name: 'plugin1',
//           path: path.resolve(__filename, '../fixtures/plugin.js')
//         }
//       ]
//     }
//   ]
//   // 未启用插件
//   const input1 = await input(stages)
//   expect(input1).toEqual([])
//   // 启用插件
//   stages[0].steps[0].enable = true
//   const input2 = await input(stages)
//   expect(input2).toEqual([{
//     stage: 'stage1',
//     plugin: 'plugin1',
//     input: [{
//       type: 'input',
//       name: 'test',
//       message: 'Type something'
//     }]
//   }])
//   // 重复插件
//   stages.push({
//     name: 'stage2',
//     steps: [
//       {
//         enable: true,
//         name: 'plugin1',
//         path: path.resolve(__filename, '../fixtures/plugin.js')
//       }
//     ]
//   })
//   const input3 = await input(stages)
//   expect(input3).toEqual([{
//     stage: 'stage1',
//     plugin: 'plugin1',
//     input: [{
//       type: 'input',
//       name: 'test',
//       message: 'Type something'
//     }]
//   }, {
//     stage: 'stage2',
//     plugin: 'plugin1',
//     input: [{
//       type: 'input',
//       name: 'test',
//       message: 'Type something'
//     }]
//   }])
// })

// combine
test('combine inputs', () => {
  const inputs = [
    {
      stage: 'stage1',
      step: 'wrongName',
      plugin: 'plugin1',
      options: {
        input1: 'input1'
      }
    }
  ]
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
  inputs[0].step = 'plugin1'
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
