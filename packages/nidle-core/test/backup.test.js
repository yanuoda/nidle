import path from 'path'
import fs from 'fs'
import Backup from '../lib/backup/backup.js'
import { copy, compress, decompress } from '../lib/backup/util.js'
const root = path.resolve(process.cwd(), 'test')
const dirname = 'test-app.202109141715'
const options = {
  name: 'test-app',
  backup: {
    path: path.resolve(root, 'backup'),
    maxCount: 2
  },
  cache: {
    path: path.resolve(root, 'cache'),
  },
  path: path.resolve(root, `build/${dirname}`)
}

function start () {
  // 创建临时目录、文件
  fs.mkdirSync(path.dirname(options.path))
  fs.mkdirSync(options.path)
  fs.writeFileSync(path.resolve(options.path, 'index.js'), 'console.log("test")')
}

function end () {
  // 清除临时目录、文件
  fs.rmSync(path.dirname(options.path), {
    recursive: true
  })
}

describe('copy & compress & decompress', () => {
  const output = path.resolve(root, 'compress')

  beforeAll(() => {
    start()
    fs.mkdirSync(output)
  })

  afterAll(() => {
    end()
    fs.rmSync(output, {
      recursive: true
    })
  })

  test('copy no remove source', async () => {
    await copy(options.path, output)

    expect(() => {
      fs.accessSync(path.resolve(output, dirname))
    })
    expect(() => {
      fs.accessSync(options.path)  
    })
  })

  test('compress no remove source', async () => {
    await compress(options.path, output)

    expect(() => {
      fs.accessSync(path.resolve(output, `${dirname}.tgz`))
    })
    expect(() => {
      fs.accessSync(options.path)  
    })
  })
  
  test('compress remove source', async () => {
    await compress(options.path, output, true)

    expect(() => {
      fs.accessSync(path.resolve(output, `${dirname}.tgz`))
    })
    expect(() => {
      fs.accessSync(options.path)
    }).toThrow()
  })

  test('decompress no remove source', async () => {
    await decompress(path.resolve(output, `${dirname}.tgz`), options.path)

    expect(() => {
      fs.accessSync(path.resolve(options.path, 'index.js'))
    })
    expect(() => {
      fs.accessSync(path.resolve(output, `${dirname}.tgz`))
    })
  })

  test('copy remove source', async () => {
    await copy(options.path, output, true)

    expect(() => {
      fs.accessSync(path.resolve(output, dirname))
    })
    expect(() => {
      fs.accessSync(options.path)
    }).toThrow()
  })
  
  test('decompress remove source', async () => {
    await decompress(path.resolve(output, `${dirname}.tgz`), options.path, true)

    expect(() => {
      fs.accessSync(path.resolve(options.path, 'index.js'))
    })
    expect(() => {
      fs.accessSync(path.resolve(output, `${dirname}.tgz`))
    }).toThrow()
  })
})

describe('backup', () => {
  beforeAll(() => {
    // 创建临时目录、文件
    start()
    fs.mkdirSync(options.backup.path)
    fs.mkdirSync(options.cache.path)
  })

  afterAll(() => {
    // 清除临时目录、文件
    end()
    fs.rmSync(options.backup.path, {
      recursive: true
    })
    fs.rmSync(options.cache.path, {
      recursive: true
    })
  })

  test('constructor test', () => {
    const backup = new Backup(options)

    expect(backup).toHaveProperty('options')
  })

  test('cache & restore compress', async () => {
    const backup = new Backup(options)

    await backup.cache()
    expect(() => {
      fs.accessSync(path.resolve(options.cache.path, `${dirname}.tgz`))
    })

    fs.rmSync(options.path, {
      recursive: true
    })
    await backup.restore()
    expect(() => {
      fs.accessSync(options.path)
    })
  })

  test('cache when publish end', async () => {
    const backup = new Backup(options)

    await backup.cache(true)
    expect(() => {
      fs.accessSync(path.resolve(options.cache.path, `${dirname}.tgz`))
    })
    expect(() => {
      fs.accessSync(options.path)
    }).toThrow()
    await backup.restore()
  })

  test('backup', async () => {
    const backup = new Backup(options)

    await backup.cache()
    await backup.backup()
    expect(() => {
      fs.accessSync(path.resolve(options.backup.path, `${dirname}.tgz`))
    })
  })

  test('backup out of maxCount', async () => {
    const backup = new Backup(options)
    copy(path.resolve(options.backup.path, `${dirname}.tgz`), path.resolve(options.backup.path, 'test-app.202109131715.tgz'))
    copy(path.resolve(options.backup.path, `${dirname}.tgz`), path.resolve(options.backup.path, 'test-app.202109121715.tgz'), true)

    await backup.cache()
    await backup.backup()
    expect(() => {
      fs.accessSync(path.resolve(options.backup.path, `${dirname}.tgz`))
    })
    expect(() => {
      fs.accessSync(path.resolve(options.backup.path, 'test-app.202109131715.tgz'))
    })
    expect(() => {
      fs.accessSync(path.resolve(options.backup.path, 'test-app.202109121715.tgz'))
    }).toThrow()
  })

  test('rollback', async () => {
    const backup = new Backup(options)

    fs.rmSync(options.path, {
      recursive: true
    })
    await backup.rollback()
    expect(() => {
      fs.accessSync(options.path)
    })
  })
})
