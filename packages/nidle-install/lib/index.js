const execa = require('execa')

async function install(task) {
  return new Promise((resolve, reject) => {
    const { source } = task
    const shell = `cd ${source} && npm install`
    const subprocess = execa(shell, {
      shell: true,
      preferLocal: true,
      execPath: task.processOptions.execPath
    })
    task.logger.info({
      name: 'install',
      detail: `execa: ${shell}`
    })

    subprocess.stdout.on('data', data => {
      const str = data.toString()

      task.logger.info({
        name: 'install',
        detail: str
      })
    })

    subprocess.stderr.on('data', data => {
      const str = data.toString()

      if (str.indexOf('ERR!') > -1) {
        task.logger.error({
          name: 'install',
          detail: str
        })
        subprocess.cancel()
        return
      }

      task.logger.info({
        name: 'install',
        detail: str
      })
    })

    subprocess.on('close', code => {
      if (code === 0) {
        resolve()
        return
      }

      const error = `child process fail: code === ${code}`
      task.logger.error({
        name: 'install',
        detail: error
      })
      reject(new Error(error))
    })
  })
}

module.exports = install
export default install
