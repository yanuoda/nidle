import Step from '../lib/step'

test('is Chainable', () => {
  const parent = { parent: true }
  const step = new Step(parent)

  expect(step.end()).toBe(parent)
})

test('shorthand methods', () => {
  const step = new Step()
  const obj = {}

  step.shorthands.forEach(method => {
    obj[method] = 'alpha'
    expect(step[method]('alpha')).toBe(step)
  })

  expect(step.clean(step.entries())).toStrictEqual(obj)
})

test('tap', () => {
  const step = new Step()
  const instance = step.tap(() => {
    return {
      a: 1,
      b: 2
    }
  })

  expect(instance).toBe(step)
  expect(step.get('options')).toStrictEqual({
    a: 1,
    b: 2
  })

  step.tap(options => {
    return {
      ...options,
      a: 3,
      c: 3
    }
  })

  expect(step.get('options')).toStrictEqual({
    a: 3,
    b: 2,
    c: 3
  })
})

test('toConfig', () => {
  const step = new Step(null, 'install')

  step.package('example-plugin')
  step.timeout(100000)
  step.options({
    a: 1
  })

  expect(step.toConfig()).toStrictEqual({
    name: 'install',
    package: 'example-plugin',
    timeout: 100000,
    retry: 0,
    options: {
      a: 1
    }
  })
})
