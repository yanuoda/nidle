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

  input() {
    return [
      {
        type: 'servers',
        name: 'servers',
        message: '请选择发布服务器'
      },
      {
        type: 'confirm',
        name: 'decompress',
        message: '是否解压',
        default: true
      },
      {
        type: 'confirm',
        name: 'authenticity',
        message: '服务器是否需要认证',
        default: true
      }
    ]
  }
}

export default ScpPlugin
