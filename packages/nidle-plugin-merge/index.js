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

  input() {
    return [
      {
        type: 'input',
        name: 'apiUrl',
        message: 'Git API base url'
      },
      {
        type: 'input',
        name: 'privateToken',
        message: 'git privateToken'
      },
      {
        type: 'input',
        name: 'targetBranch',
        message: 'merge request target branch'
      },
      {
        type: 'confirm',
        name: 'codeReview',
        message: '是否需要codeReview'
      },
      {
        type: 'confirm',
        name: 'autoMerge',
        message: '是否自动合并'
      },
      {
        type: 'confirm',
        name: 'removeSourceBranch',
        message: '是否需要移除远程分支'
      }
    ]
  }
}

export default MergePlugin
