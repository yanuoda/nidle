const execa = require('execa')

function eslint(task) {
  return new Promise((resolve, reject) => {
    const { source } = task
    const shell = `cd ${source} && npm run lint`
    const subprocess = execa(shell, {
      shell: true,
      preferLocal: true,
      execPath: task.processOptions.execPath
    })
    task.logger.info({
      name: 'eslint',
      detail: `execa: ${shell}\n`
    })

    subprocess.stdout.on('data', data => {
      const str = data.toString()

      if (str.indexOf('error:') > -1) {
        task.logger.error({
          name: 'eslint',
          detail: str
        })

        return
      }

      task.logger.info({
        name: 'eslint',
        detail: str
      })
    })

    subprocess.stderr.on('data', data => {
      const str = data.toString()

      if (str.indexOf('error:') > -1 || str.indexOf('ERR!') > -1) {
        task.logger.error({
          name: 'eslint',
          detail: str
        })
        subprocess.cancel()
        return
      }

      task.logger.warn({
        name: 'eslint',
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
        name: 'eslint',
        detail: error
      })
      reject(new Error(error))
    })
  })
}

module.exports = eslint
export default eslint
