import Config from '../lib/config'

test('is ChainedMap', () => {
  const config = new Config()
  config.set('a', 'alpha')

  expect(config.store.get('a')).toBe('alpha')
})

test('shorthand methods', () => {
  const config = new Config()
  const obj = {}

  config.shorthands.forEach(method => {
    obj[method] = 'alpha'
    expect(config[method]('alpha')).toBe(config)
  })

  expect(config.clean(config.entries())).toStrictEqual(obj)
})

test('stage', () => {
  const config = new Config()
  const instance = config.stage('install').end()

  expect(instance).toBe(config)
  expect(config.stages.has('install')).toBe(true)
})

test('toConfig empty', () => {
  const config = new Config()

  expect(config.toConfig()).toStrictEqual({})
})

test('toConfig width values', () => {
  const config = new Config()
  config
    .log({
      path: 'a.log'
    })
    .output.path('/output/a/')
    .end()
    .stage('a')
    .timeout(1000)

  expect(config.toConfig()).toStrictEqual({
    log: {
      path: 'a.log'
    },
    output: {
      path: '/output/a/'
    },
    stages: [
      {
        name: 'a',
        timeout: 1000
      }
    ]
  })
})

test('merge empty', () => {
  const config = new Config(null, 'test')
  const instance = config.merge({
    mode: 'development',
    log: {
      path: 'a.log'
    }
  })

  expect(instance).toBe(config)
  expect(config.toConfig()).toStrictEqual({
    mode: 'development',
    log: {
      path: 'a.log'
    }
  })
})

test('merge with values', () => {
  const config = new Config(null, 'test')
  config
    .mode('development')
    .log({
      path: 'a.log'
    })
    .stage('a')
    .timeout(1000)
  config.merge({
    mode: 'production',
    log: {
      path: 'b.log'
    },
    stages: [
      {
        name: 'a',
        timeout: 0
      },
      {
        name: 'b'
      }
    ]
  })

  expect(config.toConfig()).toStrictEqual({
    mode: 'production',
    log: {
      path: 'b.log'
    },
    stages: [
      {
        name: 'a',
        timeout: 0
      },
      {
        name: 'b',
        timeout: 0
      }
    ]
  })
})

test('ordered', () => {
  const config = new Config()

  config.stage('b').end().stage('a').before('b').end().stage('c').after('b')

  expect(config.toConfig().stages.map(item => item.name)).toStrictEqual(['a', 'b', 'c'])
})
