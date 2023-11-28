const execa = require('execa')
const fs = require('fs')

async function install(task, config) {
  return new Promise((resolve, reject) => {
    const { source } = task
    let action = 'install'
    let shell = `cd ${source} && npm install --production=${config.production}`

    // 判断 node_modules 目录是否存在；Y - npm update； N - npm install；
    const nodeModuleState = fs.statSync(`${source}/node_modules`, {
      throwIfNoEntry: false
    })

    if (typeof nodeModuleState !== 'undefined') {
      action = 'update'
      shell = `cd ${source} && npm update ${config.production ? '' : '-D'}`
    }

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
