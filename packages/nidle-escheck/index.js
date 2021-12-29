import PCancelable from 'p-cancelable'
import escheck from './lib/index'

class EscheckPlugin {
  apply(scheduler) {
    scheduler.add('escheck', task => {
      return new PCancelable((resolve, reject, onCancel) => {
        const subprocess = escheck(task)
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

export default EscheckPlugin
