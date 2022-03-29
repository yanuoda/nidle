import gitlabApi from './gitlab'
import githubApi from './github'

function merge(task, config) {
  return new Promise((resolve, reject) => {
    const { repository } = task
    let api = gitlabApi

    if (repository.url.indexOf('https://github.com/') === 0) {
      // github
      api = githubApi
    }

    api(task, config)
      .then(() => {
        resolve()
      })
      .catch(error => {
        reject(error)
      })
  })
}

module.exports = merge
export default merge
