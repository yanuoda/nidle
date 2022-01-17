import PCancelable from 'p-cancelable'
import merge from './lib/index'

class MergePlugin {
  apply(scheduler) {
    scheduler.add('clone', task => {
      return new PCancelable((resolve, reject, onCancel) => {
        const subprocess = merge(task)
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

export default MergePlugin
