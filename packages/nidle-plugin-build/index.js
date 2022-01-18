import PCancelable from 'p-cancelable'
import build from './lib/index'

class BuildPlugin {
  apply(scheduler) {
    scheduler.add('build', (task, config) => {
      return new PCancelable((resolve, reject, onCancel) => {
        const subprocess = build(task, config)
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
        name: 'output',
        message: '编译目标目录',
        default: 'dist'
      },
      {
        type: 'input',
        name: 'buildShell',
        message: '编译脚本',
        default: 'release.sh'
      }
    ]
  }
}

export default BuildPlugin
