import ChainedMap from './chained-map'
import Orderable from './orderable'
import Step from './step'

export default Orderable(
  class extends ChainedMap {
    constructor(parent, name) {
      super(parent)
      this.set('name', name)
      this.set('timeout', 0)
      this.steps = new ChainedMap(this)
      this.extend(['timeout'])
    }

    step(name) {
      return this.steps.getOrCompute(name, () => new Step(this, name))
    }

    merge(obj, omit = []) {
      if (!omit.includes('steps') && 'steps' in obj) {
        obj.steps.forEach(item => this.step(item.name).merge(item))
      }

      return super.merge(obj, [...omit, 'steps'])
    }

    toConfig() {
      const config = this.clean(
        Object.assign(this.entries() || {}, {
          steps: this.steps.values().map(step => step.toConfig())
        })
      )

      return config
    }
  }
)
