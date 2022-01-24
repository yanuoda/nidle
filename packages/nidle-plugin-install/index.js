import PCancelable from 'p-cancelable'
import install from './lib/index'

class InstallPlugin {
  apply(scheduler) {
    scheduler.add('install', task => {
      return new PCancelable((resolve, reject, onCancel) => {
        const subprocess = install(task)
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

  input() {
    return [
      {
        type: 'confirm',
        name: 'production',
        message: '--production',
        default: false
      }
    ]
  }
}

export default InstallPlugin
