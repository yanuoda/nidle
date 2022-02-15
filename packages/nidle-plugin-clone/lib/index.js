const path = require('path')
const execa = require('execa')

function clone(task) {
  return new Promise((resolve, reject) => {
    const { repository, source } = task
    const basename = path.basename(source)
    const dirname = path.dirname(source)

    const shell = `cd ${dirname} &&
      git clone ${repository.url}.git ${basename} --branch ${repository.branch} --progress`
    const subprocess = execa(shell, {
      shell: true
    })
    task.logger.info({
      name: 'clone',
      detail: `execa: ${shell}\n`
    })

    subprocess.stdout.on('data', data => {
      task.logger.info({
        name: 'clone',
        detail: data.toString()
      })
    })

    subprocess.stderr.on('data', data => {
      const str = data.toString()

      if (str.indexOf('fatal:') > -1 || str.indexOf('error:') > -1) {
        task.logger.error({
          name: 'clone',
          detail: str
        })
        subprocess.cancel()
        return
      }

      task.logger.info({
        name: 'clone',
        detail: str
      })
    })

    subprocess.on('close', code => {
      if (code === 0) {
        resolve()
        return
      }

      const error = `child process fail: code === ${code}\n`
      task.logger.error({
        name: 'clone',
        detail: error
      })
      reject(new Error(error))
    })
  })
}

module.exports = clone
export default clone
