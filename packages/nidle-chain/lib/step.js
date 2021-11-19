import ChainedMap from './chained-map'
import Orderable from './orderable'

export default Orderable(
  class extends ChainedMap {
    constructor(parent, name) {
      super(parent)
      this.set('name', name)
      this.set('timeout', 0)
      this.set('retry', 0)
      this.extend(['enable', 'package', 'path', 'timeout', 'retry', 'options'])
    }

    // 提供options的修改方式，可以获取原options再在此基础上修改
    tap(f) {
      this.set('options', f(this.get('options') || {}))
      return this
    }

    toConfig() {
      const config = this.clean(this.entries() || {})

      return config
    }
  }
)
