import path from 'path'
import fs from 'fs'
import Backup from '../lib/backup/backup.js'
import { copy, compress, decompress } from '../lib/backup/util.js'
const root = path.resolve(process.cwd(), 'test')
const dirname = 'test-app.202109141715'
const options = {
  name: 'test-app',
  source: path.resolve(root, '.source'),
  backup: {
    path: path.resolve(root, '.backup_backup'),
    maxCount: 2
  },
  cache: {
    path: path.resolve(root, '.backup_cache')
  },
  path: path.resolve(root, `.backup_build/${dirname}`)
}

function start() {
  // 创建临时目录、文件
  fs.mkdirSync(options.path, {
    recursive: true
  })
  fs.writeFileSync(path.resolve(options.path, 'index.js'), 'console.log("test")')
}

function end() {
  // 清除临时目录、文件
  fs.rmSync(path.dirname(options.path), {
    recursive: true
  })
}

describe('copy & compress & decompress', () => {
  const output = path.resolve(root, '.compress')

  beforeAll(() => {
    start()
  })

  afterAll(() => {
    end()
    fs.rmSync(output, {
      recursive: true
    })
  })

  test('copy no remove source', async () => {
    await copy(options.path, output)

    expect(fs.accessSync(path.resolve(output, dirname))).toBeUndefined()
    expect(fs.accessSync(options.path)).toBeUndefined()
  })

  test('compress no remove source', async () => {
    await compress(options.path, output)

    expect(fs.accessSync(path.resolve(output, `${dirname}.tar.gz`))).toBeUndefined()
    expect(fs.accessSync(options.path)).toBeUndefined()
  })

  test('compress remove source', async () => {
    await compress(options.path, output, true)

    expect(fs.accessSync(path.resolve(output, `${dirname}.tar.gz`))).toBeUndefined()
    expect(() => {
      fs.accessSync(options.path)
    }).toThrow()
  })

  test('decompress no remove source', async () => {
    await decompress(path.resolve(output, `${dirname}.tar.gz`), options.path)

    expect(fs.accessSync(path.resolve(options.path, 'index.js'))).toBeUndefined()
    expect(fs.accessSync(path.resolve(output, `${dirname}.tar.gz`))).toBeUndefined()
  })

  test('copy remove source', async () => {
    await copy(options.path, output, true)

    expect(fs.accessSync(path.resolve(output, dirname))).toBeUndefined()
    expect(() => {
      fs.accessSync(options.path)
    }).toThrow()
  })

  test('decompress remove source', async () => {
    await decompress(path.resolve(output, `${dirname}.tar.gz`), options.path, true)

    expect(fs.accessSync(path.resolve(options.path, 'index.js'))).toBeUndefined()
    expect(() => {
      fs.accessSync(path.resolve(output, `${dirname}.tar.gz`))
    }).toThrow()
  })
})

describe('backup', () => {
  beforeAll(() => {
    // 创建临时目录、文件
    start()
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
    expect(fs.accessSync(path.resolve(options.cache.path, `${dirname}.tar.gz`))).toBeUndefined()

    fs.rmSync(options.path, {
      recursive: true
    })
    await backup.restore()
    expect(fs.accessSync(options.path)).toBeUndefined()
  })

  test('cache & remove source', async () => {
    const backup = new Backup(options)

    await backup.cache(true)
    expect(fs.accessSync(path.resolve(options.cache.path, `${dirname}.tar.gz`))).toBeUndefined()
    expect(() => {
      fs.accessSync(options.path)
    }).toThrow()
    await backup.restore()
  })

  test('backup', async () => {
    const backup = new Backup(options)

    await backup.backup()
    expect(fs.accessSync(path.resolve(options.backup.path, `${dirname}.tar.gz`))).toBeUndefined()
  })

  test('backup out of maxCount', async () => {
    const backup = new Backup(options)

    await copy(
      path.resolve(options.backup.path, `${dirname}.tar.gz`),
      path.resolve(options.backup.path, 'test-app.202109131715.tar.gz')
    )
    await copy(
      path.resolve(options.backup.path, `${dirname}.tar.gz`),
      path.resolve(options.backup.path, 'test-app.202109121715.tar.gz'),
      true
    )
    await backup.backup()

    expect(fs.accessSync(path.resolve(options.backup.path, `${dirname}.tar.gz`))).toBeUndefined()
    expect(fs.accessSync(path.resolve(options.backup.path, 'test-app.202109131715.tar.gz'))).toBeUndefined()
    expect(() => {
      fs.accessSync(path.resolve(options.backup.path, 'test-app.202109121715.tar.gz'))
    }).toThrow()
  })

  test('rollback', async () => {
    const backup = new Backup(options)

    fs.rmSync(options.path, {
      recursive: true
    })
    await backup.rollback()
    expect(fs.accessSync(options.path)).toBeUndefined()
  })
})
