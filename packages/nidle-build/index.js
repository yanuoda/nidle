import PCancelable from 'p-cancelable'
import build from './lib/index'

class ClonePlugin {
  apply(scheduler) {
    scheduler.add('build', (task, config) => {
      return new PCancelable((resolve, reject, onCancel) => {
        const subprocess = build(task, config)
          .then(function () {
            resolve()
          })
          .catch(function (error) {
            reject(error)
          })

        onCancel(() => {
          subprocess.cancel()
        })
      })
    })
  }
}

export default ClonePlugin
