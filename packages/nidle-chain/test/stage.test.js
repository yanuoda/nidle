import Stage from '../lib/stage'

test('is Chainable', () => {
  const parent = { parent: true }
  const stage = new Stage(parent)

  expect(stage.end()).toBe(parent)
})

test('shorthand methods', () => {
  const stage = new Stage()
  const obj = {}

  stage.shorthands.forEach(method => {
    obj[method] = 'alpha'
    expect(stage[method]('alpha')).toBe(stage)
  })

  expect(stage.clean(stage.entries())).toStrictEqual(obj)
})

test('step', () => {
  const stage = new Stage()
  const instance = stage.step('install').end()

  expect(instance).toBe(stage)
  expect(stage.steps.has('install')).toBe(true)
})

test('toConfig', () => {
  const stage = new Stage(null, 'test')

  expect(stage.toConfig()).toStrictEqual({
    name: 'test',
    timeout: 0
  })
})

test('toConfig with steps', () => {
  const stage = new Stage(null, 'test')
  stage.timeout(1000)
  stage.step('a').package('a-plugin').options({
    a: 1
  })

  expect(stage.toConfig()).toStrictEqual({
    name: 'test',
    timeout: 1000,
    steps: [
      {
        name: 'a',
        package: 'a-plugin',
        timeout: 0,
        retry: 0,
        options: {
          a: 1
        }
      }
    ]
  })
})

test('merge empty', () => {
  const stage = new Stage(null, 'test')
  const instance = stage.merge({
    timeout: 1000
  })

  expect(instance).toBe(stage)
  expect(stage.toConfig()).toStrictEqual({
    name: 'test',
    timeout: 1000
  })
})

test('merge with values', () => {
  const stage = new Stage(null, 'test')
  stage.timeout(10000)
  stage.merge({
    timeout: 1000
  })

  expect(stage.toConfig()).toStrictEqual({
    name: 'test',
    timeout: 1000
  })
})

test('merge with steps', () => {
  const stage = new Stage(null, 'test')
  stage.step('a').package('a-plugin').options({
    a: 1,
    b: 2
  })
  stage.merge({
    steps: [
      {
        name: 'a',
        package: 'a-new-plugin',
        options: {
          a: 2,
          b: 2,
          c: 3
        }
      },
      {
        name: 'b',
        package: 'b-plugin',
        options: {
          a: 1
        }
      }
    ]
  })

  expect(stage.toConfig()).toStrictEqual({
    name: 'test',
    timeout: 0,
    steps: [
      {
        name: 'a',
        retry: 0,
        timeout: 0,
        package: 'a-new-plugin',
        options: {
          a: 2,
          b: 2,
          c: 3
        }
      },
      {
        name: 'b',
        retry: 0,
        timeout: 0,
        package: 'b-plugin',
        options: {
          a: 1
        }
      }
    ]
  })
})

test('ordered', () => {
  const stage = new Stage(null, 'test')

  stage
    .step('b')
    .package('b-plugin')
    .end()
    .step('a')
    .package('a-plugin')
    .before('b')
    .end()
    .step('c')
    .package('c-plugin')
    .after('b')

  expect(stage.toConfig().steps.map(item => item.package)).toStrictEqual(['a-plugin', 'b-plugin', 'c-plugin'])
})
