export default class {
  apply(scheduler) {
    scheduler.add('name', (task, config) => {
      return new Promise((resolve, reject) => {
        if (config.development === 'PRODUCTION') {
          resolve()
        } else {
          reject(new Error(`can‘t use in ${config.development} development`))
        }
      })
    })
  }
}
