const fs = require('fs')
const path = require('path')
const execa = require('execa')

function build(task, config = {}) {
  return new Promise((resolve, reject) => {
    const { source, output } = task
    const sh = config.buildShell
    const buildFileState = fs.statSync(path.resolve(source, sh), {
      throwIfNoEntry: false
    })

    if (!buildFileState) {
      const error = `build shell: ${sh} is not existed.\n`
      task.logger.error({
        name: 'build',
        detail: error
      })
      reject(new Error(error))
      return
    }

    if (!config.output) {
      const error = `config.output is required.\n`
      task.logger.error({
        name: 'build',
        detail: error
      })
      reject(new Error(error))
      return
    }

    const shell = `cd ${source} && /bin/sh ${sh} ${task.mode}`
    const subprocess = execa(shell, {
      shell: true,
      preferLocal: true,
      execPath: task.processOptions.execPath
    })
    task.logger.info({
      name: 'build',
      detail: `execa: ${shell}\n`
    })

    subprocess.stdout.on('data', data => {
      const str = data.toString()

      if (str.indexOf('ERROR') > -1) {
        task.logger.error({
          name: 'build',
          detail: str
        })

        return
      }

      task.logger.info({
        name: 'build',
        detail: str
      })
    })

    subprocess.stderr.on('data', data => {
      const str = data.toString()

      if (str.indexOf('ERR!') > -1 || str.indexOf('ERROR') > -1 || str.indexOf('fatal:') > -1) {
        task.logger.error({
          name: 'build',
          detail: str
        })
        subprocess.cancel()

        return
      }

      if (str.indexOf('[webpack.Progress]') > -1) {
        // 无用日志，不记录
        return
      }

      task.logger.info({
        name: 'build',
        detail: str
      })
    })

    subprocess.on('close', async code => {
      if (code === 0) {
        try {
          await copy()
          resolve()
        } catch (err) {
          reject(err)
        }

        return
      }

      const error = `child process fail: code === ${code}`
      task.logger.error({
        name: 'build',
        detail: error
      })
      reject(new Error(error))
    })

    async function copy() {
      try {
        const childprocess = await execa(`cp -rpf ${path.resolve(source, config.output, '*')} ${output.path}`, {
          shell: true
        })
        task.logger.info({
          name: 'build',
          detail: childprocess.command
        })

        return
      } catch (err) {
        task.logger.error({
          name: 'build',
          detail: err.message
        })
        throw err
      }
    }
  })
}

module.exports = build
export default build
