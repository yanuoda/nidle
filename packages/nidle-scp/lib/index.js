const fs = require('fs')
const path = require('path')
const execa = require('execa')

function scp(task, config) {
  return new Promise((resolve, reject) => {
    const { output } = task
    const { server = [] } = config.privacy || {}

    if (!server.length) {
      return reject(new Error('server list is required.'))
    }

    const basename = path.basename(output.path)
    const dirname = path.dirname(output.path)
    const tarname = basename + '.tar.gz'
    const serverFile = path.resolve(dirname, 'server.config')

    try {
      // 将server信息写入文件，方便shell脚本遍历
      const serverStr =
        server
          .map(item => {
            const appName = path.basename(item.output)
            const outputDir = path.dirname(item.output)
            return `${item.ip} ${item.username} ${item.password} ${outputDir} ${appName}`
          })
          .join('\n') + '\n'

      fs.writeFileSync(serverFile, serverStr)

      const subprocess = execa(path.resolve(__dirname, '../shell/scp.sh'), [
        serverFile,
        dirname,
        output.path,
        tarname,
        path.resolve(__dirname, '../shell/expect.sh'),
        config.decompress === false ? 0 : 1
      ])

      subprocess.stdout.on('data', data => {
        task.logger.info({
          name: 'scp',
          detail: data.toString()
        })
      })

      subprocess.stderr.on('data', data => {
        const str = data.toString()

        task.logger.error({
          name: 'scp',
          detail: str
        })
        subprocess.cancel()
      })

      subprocess.on('close', code => {
        if (code === 0) {
          task.output.tarFileName = tarname
          // 删除临时文件

          fs.rmSync(serverFile)
          fs.rmSync(path.resolve(dirname, tarname))
          console.log(1111)
          resolve()
          return
        }

        const error = `child process fail: code === ${code}`
        task.logger.error({
          name: 'scp',
          detail: error
        })
        reject(new Error(error))
      })
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = scp
export default scp
