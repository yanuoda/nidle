import PCancelable from 'p-cancelable'
import clone from './lib/index'

class ClonePlugin {
  apply(scheduler) {
    scheduler.add('clone', task => {
      return new PCancelable((resolve, reject, onCancel) => {
        const subprocess = clone(task)
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
