import PCancelable from 'p-cancelable'
import imagemin from './lib/index'

class ImageminPlugin {
  apply(scheduler) {
    scheduler.add('imagemin', (task, config) => {
      return new PCancelable((resolve, reject, onCancel) => {
        const subprocess = imagemin(task, config)
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
        name: 'source',
        message: '图片目录相对路径(多目录,分割，默认output.path)',
        default: '',
        required: false
      },
      {
        type: 'number',
        name: 'quality',
        message: '图片压缩质量(只作用于jpg)',
        default: 75
      }
    ]
  }
}

export default ImageminPlugin
