import ChainedMap from './chained-map'
import Stage from './stage'

export default class Config extends ChainedMap {
  constructor() {
    super()
    this.stages = new ChainedMap(this)
    const output = (this.output = new ChainedMap(this))
    output.extend(['backup', 'cache', 'path'])
    this.extend(['mode', 'log', 'type'])
  }

  stage(name) {
    return this.stages.getOrCompute(name, () => new Stage(this, name))
  }

  merge(obj = {}, omit = []) {
    if (!omit.includes('stages') && 'stages' in obj) {
      obj.stages.forEach(item => this.stage(item.name).merge(item))
    }

    if ('output' in obj) {
      this.output.merge(obj.output)
    }

    return super.merge(obj, [...omit, 'stages', 'output'])
  }

  toConfig() {
    const config = this.clean(
      Object.assign(this.entries() || {}, {
        output: this.output.entries(),
        stages: this.stages.values().map(stage => stage.toConfig())
      })
    )

    return config
  }
}
