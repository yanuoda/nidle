import PCancelable from 'p-cancelable'
import eslint from './lib/index'

class EslintPlugin {
  apply(scheduler) {
    scheduler.add('eslint', task => {
      return new PCancelable((resolve, reject, onCancel) => {
        const subprocess = eslint(task)
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

export default EslintPlugin
