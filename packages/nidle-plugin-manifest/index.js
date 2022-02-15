import PCancelable from 'p-cancelable'
import manifest from './lib/index'

class ManifestPlugin {
  apply(scheduler) {
    scheduler.add('clone', (task, config) => {
      return new PCancelable((resolve, reject, onCancel) => {
        const subprocess = manifest(task, config)
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
        name: 'apiUrl',
        message: 'CMS 同步API'
      },
      {
        type: 'input',
        name: 'siteId',
        message: 'CMS siteId'
      },
      {
        type: 'input',
        name: 'deployId',
        message: 'CMS deployId'
      },
      {
        type: 'input',
        name: 'mode',
        message: '环境'
      }
    ]
  }
}

export default ManifestPlugin
