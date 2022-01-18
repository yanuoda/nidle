import PCancelable from 'p-cancelable'
import start from './lib/index'

class ManifestPlugin {
  apply(scheduler) {
    scheduler.add('clone', (task, config) => {
      return new PCancelable((resolve, reject, onCancel) => {
        const subprocess = start(task, config)
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
        type: 'input',
        name: 'shellFile',
        message: 'Start shell filePath'
      }
    ]
  }
}

export default ManifestPlugin
