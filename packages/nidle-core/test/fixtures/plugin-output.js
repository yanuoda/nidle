import { copy } from '../../lib/backup/util'

export default class {
  apply(scheduler) {
    scheduler.add('publish', task => {
      return new Promise(async (resolve, reject) => {
        try {
          await copy(task.source, task.output.path)
          task.logger.info({
            name: 'publish',
            detail: `${task.name}代码发布完成.`
          })

          resolve()
        } catch (err) {
          console.log(11111, err)
          reject(err)
        }
      })
    })
  }
}
