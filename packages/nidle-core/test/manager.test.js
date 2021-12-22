import path from 'path'
import fs from 'fs'
import Manager from '../lib/manager.js'
import { options, productionOptions } from './fixtures/config'
import { input } from '../lib/config/index.js'
const root = path.resolve(process.cwd(), 'test')

afterAll(() => {
  // 清除临时目录、文件
  fs.rmSync(options.log.path, {
    recursive: true,
    force: true
  })
  fs.rmSync(path.dirname(options.source), {
    recursive: true,
    force: true
  })
  fs.rmSync(path.dirname(options.output.path), {
    recursive: true,
    force: true
  })
  // fs.rmSync(options.output.cache.path, {
  //   recursive: true,
  //   force: true
  // })
  fs.rmSync(options.output.backup.path, {
    recursive: true,
    force: true
  })
})

test('constructor test', () => {
  expect(() => {
    new Manager({})
  }).toThrow()

  const manager = new Manager(options)

  expect(manager).toHaveProperty('config')
  expect(manager).toHaveProperty('update')
  expect(manager).toHaveProperty('scheduler', null)
})

test('init', async () => {
  const manager = new Manager(options)
  const { inputs } = await manager.init()

  expect(inputs).toEqual([
    {
      stage: 'build',
      step: 'download',
      plugin: path.resolve(root, 'fixtures/plugin-init.js'),
      input: [
        {
          type: 'input',
          name: 'test',
          message: 'Type something'
        }
      ]
    }
  ])
})

test('mount', async () => {
  const manager = new Manager(options)

  await manager.init()
  await manager.mount([
    {
      stage: 'build',
      plugin: 'download',
      options: {
        test: 'dev'
      }
    }
  ])
  expect(manager).toHaveProperty('logger')
  expect(manager).toHaveProperty('backup')
  expect(manager).toHaveProperty('scheduler')
  manager.log.end()
})

test('start', done => {
  const manager = new Manager(options)
  manager.init().then(() => {
    manager
      .mount([
        {
          stage: 'build',
          plugin: 'download',
          options: {
            test: 'dev'
          }
        }
      ])
      .then(() => {
        manager.start().then(() => {
          manager.on('completed', () => {
            const basename = path.basename(options.output.path)

            expect(() => {
              fs.accessSync(path.resolve(options.output.backup.path, `${basename}.tgz`))
            }).toThrow()
            // expect(() => {
            //   fs.accessSync(path.resolve(options.output.cache.path, `${basename}.tgz`))
            // }).toBeUndefined()
            expect(fs.accessSync(options.source)).toBeUndefined()
            done()
          })
          manager.on('error', error => {
            done(error)
          })
        })
      })
  })
})

test('cancel', done => {
  const manager = new Manager(options)
  expect(fs.accessSync(options.source)).toBeUndefined()
  manager.cancel().then(() => {
    expect(() => {
      fs.accessSync(options.output.path)
    }).toThrow()
    expect(() => {
      fs.accessSync(options.source)
    }).toThrow()
    done()
  })
})

test('start when mode === production', done => {
  const manager = new Manager(productionOptions)
  manager.init().then(() => {
    manager
      .mount([
        {
          stage: 'build',
          step: 'download',
          options: {
            test: 'dev'
          }
        }
      ])
      .then(() => {
        manager.start().then(() => {
          manager.on('completed', () => {
            const basename = path.basename(productionOptions.output.path)

            expect(fs.accessSync(path.resolve(productionOptions.output.backup.path, `${basename}.tgz`))).toBeUndefined()
            expect(() => {
              fs.accessSync(productionOptions.source)
            }).toThrow()
            done()
          })
          manager.on('error', error => {
            done(error)
          })
        })
      })
  })
})

test('start from index !== 0', done => {
  const manager = new Manager(options)
  manager.init().then(() => {
    manager
      .mount([
        {
          stage: 'build',
          plugin: 'download',
          options: {
            test: 'dev'
          }
        }
      ])
      .then(() => {
        manager.start(1).catch(err => {
          expect(err.message).toEqual('start must from index = 0!')
          done()
        })
      })
  })
})

// test('stage 2 error first time', done => {
//   const manager = new Manager(retryOptions)
//   manager.init().then(() => {
//     manager
//       .mount([
//         {
//           stage: 'build',
//           plugin: 'download',
//           options: {
//             test: 'dev'
//           }
//         },
//         {
//           stage: 'publish',
//           plugin: 'publish',
//           options: {
//             development: 'SIT'
//           }
//         }
//       ])
//       .then(() => {
//         manager.start().then(() => {
//           manager.on('completed', () => {
//             done()
//           })
//           manager.on('error', error => {
//             expect(error.message).toBe('step publish error')
//             const basename = path.basename(retryOptions.output.path)

//             expect(fs.accessSync(path.resolve(retryOptions.output.cache.path, `${basename}.tgz`))).toBeUndefined()
//             expect(fs.accessSync(retryOptions.output.path)).toBeUndefined()
//             expect(() => {
//               fs.accessSync(path.resolve(retryOptions.output.backup.path, `${basename}.tgz`))
//             }).toThrow()
//             done()
//           })
//         })
//       })
//   })
// })

// test('stage retry success', done => {
//   const manager = new Manager(retryOptions)
//   manager.init().then(() => {
//     manager
//       .mount([
//         {
//           stage: 'build',
//           step: 'download',
//           plugin: path.resolve(root, 'fixtures/plugin-init.js'),
//           options: {
//             test: 'dev'
//           }
//         },
//         {
//           stage: 'publish',
//           step: 'publish',
//           plugin: path.resolve(root, 'fixtures/plugin-retry.js'),
//           options: {
//             development: 'PRODUCTION'
//           }
//         }
//       ])
//       .then(() => {
//         manager.start(1).then(() => {
//           manager.on('completed', () => {
//             const log = fs.readFileSync(retryOptions.log.all, {
//               encoding: 'utf-8'
//             })
//             expect(log.indexOf('RESTORE COMPLETE') > -1)

//             done()
//           })
//           manager.on('error', error => {
//             done(error)
//           })
//         })
//       })
//   })
// })

test('rollback', done => {
  const manager = new Manager(productionOptions)
  manager.init().then(() => {
    manager
      .mount([
        {
          stage: 'build',
          step: 'download',
          plugin: 'download',
          options: {
            test: 'dev'
          }
        }
      ])
      .then(() => {
        manager.rollback().then(() => {
          manager.on('completed', () => {
            const log = fs.readFileSync(productionOptions.log.all, {
              encoding: 'utf-8'
            })
            expect(log.indexOf('ROLLBACK COMPLETE') > -1)
            done()
          })
          manager.on('error', error => {
            done(error)
          })
        })
      })
  })
}, 2000)

// input
// 将本来应该在`config.test.js`中的input测试移过来，因为 jest 动态依赖在两个测试文件中会报错
// `You are trying to `import` a file after the Jest environment has been torn down`
test('plugin inputs', async () => {
  const stages = [
    {
      name: 'stage1',
      steps: [
        {
          enable: false,
          name: 'plugin1',
          path: path.resolve(root, 'fixtures/plugin.js')
        }
      ]
    }
  ]
  // 未启用插件
  const input1 = await input(stages)
  expect(input1).toEqual([])
  // 启用插件
  stages[0].steps[0].enable = true
  const input2 = await input(stages)
  expect(input2).toEqual([
    {
      stage: 'stage1',
      step: 'plugin1',
      plugin: path.resolve(root, 'fixtures/plugin.js'),
      input: [
        {
          type: 'input',
          name: 'test',
          message: 'Type something'
        }
      ]
    }
  ])
  // 重复插件
  stages.push({
    name: 'stage2',
    steps: [
      {
        enable: true,
        name: 'plugin1',
        path: path.resolve(root, 'fixtures/plugin.js')
      }
    ]
  })
  const input3 = await input(stages)
  expect(input3).toEqual([
    {
      stage: 'stage1',
      step: 'plugin1',
      plugin: path.resolve(root, 'fixtures/plugin.js'),
      input: [
        {
          type: 'input',
          name: 'test',
          message: 'Type something'
        }
      ]
    },
    {
      stage: 'stage2',
      step: 'plugin1',
      plugin: path.resolve(root, 'fixtures/plugin.js'),
      input: [
        {
          type: 'input',
          name: 'test',
          message: 'Type something'
        }
      ]
    }
  ])
})
