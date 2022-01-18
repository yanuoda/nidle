const fs = require('fs')
const path = require('path')
const execa = require('execa')

function start(task, config) {
  return new Promise((resolve, reject) => {
    const { output } = task
    const { shellFile } = config || {}
    const basename = path.basename(output.path)
    const dirname = path.dirname(output.path)
    const serverFile = path.resolve(dirname, `server.${basename}.config`)

    const serverState = fs.statSync(serverFile, {
      throwIfNoEntry: false
    })

    if (!serverState) {
      return reject(new Error('server file不存在, 你确定已使用 nidle-plugin-scp 插件同步代码到服务器并且没有解压？'))
    }

    try {
      let hasError = false
      const subprocess = execa(path.resolve(__dirname, '../shell/start.sh'), [
        serverFile,
        output.tarFileName,
        path.resolve(__dirname, '../shell/expect.sh'),
        shellFile
      ])

      subprocess.stdout.on('data', data => {
        const str = data.toString()

        if (str.indexOf('tar: ') > -1) {
          // 解压会出现一串无用日志冲掉日志
          return
        }

        if (str.indexOf('ERROR') > -1) {
          task.logger.error({
            name: 'start',
            detail: data.toString()
          })
          hasError = true
          return
        }

        task.logger.info({
          name: 'start',
          detail: data.toString()
        })
      })

      subprocess.stderr.on('data', data => {
        const str = data.toString()

        task.logger.error({
          name: 'start',
          detail: str
        })
        subprocess.cancel()
      })

      subprocess.on('close', code => {
        if (hasError) {
          return reject(new Error('Start Error:: 更多信息查看日志.'))
        }

        if (code === 0) {
          // 删除临时文件
          fs.rmSync(serverFile)

          resolve()
          return
        }

        const error = `child process fail: code === ${code}`
        task.logger.error({
          name: 'start',
          detail: error
        })
        reject(new Error(error))
      })
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = start
export default start
