const fs = require('fs')
const path = require('path')
const execa = require('execa')

function scp(task, config) {
  return new Promise((resolve, reject) => {
    const { output, mode } = task
    const { servers = [], decompress, authenticity } = config || {}

    if (!servers.length) {
      return reject(new Error('server list is required.'))
    }

    const basename = path.basename(output.path)
    const dirname = path.dirname(output.path)
    const tarname = basename + '.tar.gz'
    const serverFile = path.resolve(dirname, `server.${basename}.config`)

    try {
      // 将server信息写入文件，方便shell脚本遍历
      const serverStr =
        servers
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
        decompress === false ? 0 : 1,
        authenticity === false ? 0 : 1,
        mode === 'production' ? 1 : 0
      ])

      subprocess.stdout.on('data', data => {
        const str = data.toString()

        if (str.indexOf('tar: ') > -1) {
          // 解压会出现一串无用日志冲掉日志
          return
        }

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

          if (decompress !== false) {
            // 不解压，说明等待后续解压使用，所以保留服务文件，以便后续插件使用
            fs.rmSync(serverFile)
          }
          fs.rmSync(path.resolve(dirname, tarname))

          resolve()
          return
        }

        const error = `child process fail: code === ${code}\n`
        task.logger.error({
          name: 'scp',
          detail: error
        })
        reject(new Error(error))
      })

      subprocess.on('error', err => {
        reject(err)
      })
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = scp
export default scp
