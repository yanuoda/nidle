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
      detail: `execa: ${shell}`
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

    let isMissScript = false

    subprocess.stderr.on('data', data => {
      const str = data.toString()

      if (str.indexOf('missing script:') > -1) {
        task.logger.warn({
          name: 'eslint',
          detail: str
        })
        isMissScript = true

        return
      }

      task.logger.error({
        name: 'eslint',
        detail: str
      })

      subprocess.cancel()
    })

    subprocess.on('close', code => {
      if (code === 0 || isMissScript) {
        resolve()
        return
      }

      const error = `child process fail: code === ${code}`
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
