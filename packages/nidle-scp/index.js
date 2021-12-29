import PCancelable from 'p-cancelable'
import scp from './lib/index'

class ScpPlugin {
  apply(scheduler) {
    scheduler.add('scp', (task, config) => {
      return new PCancelable((resolve, reject, onCancel) => {
        const subprocess = scp(task, config)
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

export default ScpPlugin
