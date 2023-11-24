const path = require('path')
const execa = require('execa')
const fs = require('fs')

function clone(task) {
  return new Promise(async (resolve, reject) => {
    const { repository, source } = task
    const basename = path.basename(source)
    const dirname = path.dirname(source)
    let action = 'clone'
    let shell = `cd ${dirname} &&
      git clone ${repository.url}.git ${basename} --branch ${repository.branch} --progress`

    // 判断 basename 目录是否存在，存在则判断分支是否一致；Y - git pull； N - git clone；
    const sourceState = fs.statSync(source, {
      throwIfNoEntry: false
    })

    if (typeof sourceState !== 'undefined') {
      const { stdout } = await execa(`cd ${source} && git branch --show-current`, {
        shell: true
      })

      if (stdout === repository.branch) {
        action = 'pull'
        shell = `cd ${source} && git pull`
      } else {
        fs.rmSync(source, {
          recursive: true
        })
      }
    }

    const subprocess = execa(shell, {
      shell: true
    })
    task.logger.info({
      name: action,
      detail: `execa: ${shell}\n`
    })

    subprocess.stdout.on('data', data => {
      task.logger.info({
        name: action,
        detail: data.toString()
      })
    })

    subprocess.stderr.on('data', data => {
      const str = data.toString()

      if (str.indexOf('fatal:') > -1 || str.indexOf('error:') > -1) {
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

module.exports = clone
export default clone
