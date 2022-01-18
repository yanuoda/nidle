const path = require('path')
const fs = require('fs')
const execa = require('execa')
const semver = require('semver')

async function nvm(task) {
  return new Promise(async (resolve, reject) => {
    const { source } = task
    const pkg = require(path.resolve(source, 'package.json'))
    let requiredVersion = pkg.engines ? pkg.engines.node : '8'
    let hasInstall = true
    let nodeVersion

    // 如果.nvmrc存在，直接基于它去做nvm版本控制
    const nvmrcFile = path.resolve(source, '.nvmrc')
    const nvmrcState = fs.statSync(nvmrcFile, {
      throwIfNoEntry: false
    })

    if (nvmrcState) {
      requiredVersion = fs
        .readFileSync(nvmrcFile, {
          encoding: 'utf-8'
        })
        .replace(/\s+/g, '')
    }

    if (semver.valid(semver.coerce(requiredVersion)) === null) {
      const error = `Invalid semantic version: ${requiredVersion}`
      task.logger.error({
        name: 'nvm',
        detail: error
      })
      reject(new Error(error))
      return
    }

    // 确认依赖版本是否已安装
    try {
      const childprocess = await execa(`unset PREFIX && source $NVM_DIR/nvm.sh && nvm ls --no-colors --no-alias`, {
        shell: true
      })
      const list = childprocess.stdout
        .replace(/(\s+|->|v)/g, '')
        .split('*')
        .filter(item => {
          return item !== 'system' && item !== ''
        })
      // 找到最高的合适版本
      nodeVersion = semver.maxSatisfying(list, requiredVersion)
    } catch (err) {
      reject(err)
      return
    }

    // 未安装，查找最合适的远程版本
    if (!nodeVersion) {
      hasInstall = false

      try {
        const childprocess = await execa(`unset PREFIX && source $NVM_DIR/nvm.sh && nvm ls-remote --no-colors`, {
          shell: true
        })
        const list = childprocess.stdout
          .replace(/(\*|\(.*?\))/g, '')
          .split('\n')
          .map(function (item) {
            return semver.clean(item)
          })
        // 找到最高的合适版本
        nodeVersion = semver.maxSatisfying(list, requiredVersion)
      } catch (err) {
        reject(err)
        return
      }
    }

    if (!nodeVersion) {
      const error = `Invalid node version: ${requiredVersion}`
      task.logger.error({
        name: 'nvm',
        detail: error
      })
      reject(new Error(error))
      return
    }

    if (hasInstall) {
      await setProcessOptions()
      resolve()
    } else {
      try {
        const subprocess = execa(
          `unset PREFIX && source $NVM_DIR/nvm.sh && cd ${source} && nvm install ${nodeVersion}`,
          {
            shell: true
          }
        )

        subprocess.stdout.on('data', data => {
          const str = data.toString()

          task.logger.info({
            name: 'nvm',
            detail: str
          })
        })

        subprocess.stderr.on('data', data => {
          const str = data.toString()

          if (str.indexOf('ERR!') > -1) {
            task.logger.error({
              name: 'nvm',
              detail: str
            })
            subprocess.cancel()
            return
          }

          task.logger.info({
            name: 'nvm',
            detail: str
          })
        })

        subprocess.on('close', async code => {
          if (code === 0) {
            try {
              await setProcessOptions()
              resolve()
            } catch (err) {
              reject(err)
            }

            return
          }

          const error = `child process fail: code === ${code}`
          reject(new Error(error))
        })
      } catch (err) {
        reject(err)
      }
    }

    async function setProcessOptions() {
      try {
        const { stdout: execPath } = await execa(`unset PREFIX && source $NVM_DIR/nvm.sh && nvm which ${nodeVersion}`, {
          shell: true
        })
        task.logger.info({
          name: 'nvm',
          detail: `Project match node version: ${nodeVersion} & execPath: ${execPath}`
        })
        task.processOptions = {
          ...(task.processOptions || {}),
          execPath
        }

        return
      } catch (err) {
        throw err
      }
    }
  })
}

module.exports = nvm
export default nvm
