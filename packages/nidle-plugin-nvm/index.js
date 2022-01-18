import PCancelable from 'p-cancelable'
import nvm from './lib/index'

class NvmPlugin {
  apply(scheduler) {
    scheduler.add('nvm', task => {
      return new PCancelable((resolve, reject, onCancel) => {
        const subprocess = nvm(task)
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

export default NvmPlugin
