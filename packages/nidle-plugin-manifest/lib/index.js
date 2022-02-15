const path = require('path')
const fs = require('fs')
const axios = require('axios')

function manifest(task, config) {
  return new Promise((resolve, reject) => {
    const { output } = task
    const { apiUrl, mode, siteId, deployId } = config
    const manifestFile = path.resolve(output.path, 'manifest.json')

    const manifestState = fs.statSync(manifestFile, {
      throwIfNoEntry: false
    })

    if (!manifestState) {
      const error = 'manifest.json is not existed.\n'
      task.logger.error({
        name: 'manifest',
        detail: error
      })
      reject(new Error(error))
      return
    }

    const data = fs.readFileSync(manifestFile, {
      encoding: 'utf-8'
    })

    axios({
      url: `${apiUrl}?siteId=${siteId}`,
      method: 'POST',
      data: {
        id: deployId,
        model: {
          environment: mode,
          manifest: data
        }
      }
    })
      .then(response => {
        const { success, message } = response.data

        if (success === true) {
          task.logger.info({
            name: 'manifest',
            detail: 'Sync manifest success\n'
          })
          resolve()
        } else {
          task.logger.error({
            name: 'manifest',
            detail: 'Sync manifest error:: ' + message + '\n'
          })
          reject(new Error(message))
        }
      })
      .catch(err => {
        task.logger.info({
          name: 'manifest',
          detail: 'Sync manifest error:: ' + err.message + '\n'
        })
        reject(err)
      })
  })
}

module.exports = manifest
export default manifest
