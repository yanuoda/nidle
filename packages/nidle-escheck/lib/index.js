const fs = require('fs')
const path = require('path')
const esCheck = require('es-check-format')

function escheck(task) {
  return new Promise((resolve, reject) => {
    const { source } = task
    const rcfileState = fs.statSync(path.resolve(source, '.escheckrc'), {
      throwIfNoEntry: false
    })

    if (!rcfileState) {
      resolve()
      return
    }

    esCheck({
      context: source
    })
      .then(errors => {
        if (errors.length) {
          const message = errors.map(o => {
            return `
            ES-Check Error:
            ----
            · erroring file: ${o.file}
            · source file: ${o.source}
            . location: { line: ${o.line}, column: ${o.column} }
            . code: ${o.code}
            ----\n
          `
          })

          task.logger.error({
            name: 'es-check',
            detail: message.join('\n')
          })
          reject(new Error('es-check failed'))
        } else {
          task.logger.info({
            name: 'es-check',
            detail: 'es-check success'
          })
          resolve()
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = escheck
export default escheck
