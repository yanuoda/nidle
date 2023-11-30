const execa = require('execa')

async function install(task, config) {
  return new Promise((resolve, reject) => {
    const { source } = task
    const action = 'install'
    const shell = `cd ${source} && npm install --production=${config.production}`

    const subprocess = execa(shell, {
      shell: true,
      preferLocal: true,
      execPath: task.processOptions.execPath
    })
    task.logger.info({
      name: action,
      detail: `execa: ${shell}\n`
    })

    subprocess.stdout.on('data', data => {
      const str = data.toString()

      task.logger.info({
        name: action,
        detail: str
      })
    })

    subprocess.stderr.on('data', data => {
      const str = data.toString()

      if (str.indexOf('ERR!') > -1) {
        task.logger.error({
          name: action,
          detail: str
        })
        subprocess.cancel()
        return
      }

      task.logger.info({
        name: action,
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
        name: action,
        detail: error
      })
      reject(new Error(error))
    })
  })
}

module.exports = install
export default install
