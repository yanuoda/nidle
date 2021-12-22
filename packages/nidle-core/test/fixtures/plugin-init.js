import path from 'path'
import fs from 'fs'

export default class {
  apply(scheduler) {
    scheduler.add('name', (task, config) => {
      return new Promise(resolve => {
        fs.mkdirSync(task.source, {
          recursive: true
        })
        fs.writeFileSync(path.resolve(task.source, 'index.js'), 'console.log("test")')
        task.logger.info({
          name: 'name',
          detail: `${task.name}/${config.test}分支代码下载完成.`
        })
        resolve()
      })
    })
  }

  input() {
    return [
      {
        type: 'input',
        name: 'test',
        message: 'Type something'
      }
    ]
  }
}
