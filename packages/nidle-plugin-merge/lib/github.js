const axios = require('axios')

const regNamespace = /^https:\/\/github.com\/([a-zA-Z\-\d]+)\/([a-zA-Z\-\d]+)/

function parseName(repository) {
  const match = repository.match(regNamespace)

  if (match) {
    return {
      repo: match[2],
      owner: match[1]
    }
  } else {
    throw new Error('Invalid repository url!')
  }
}

function merge(task, config) {
  return new Promise((resolve, reject) => {
    const { repository } = task
    const { apiUrl, privateToken, sourceBranch, targetBranch, codeReview, autoMerge, removeSourceBranch } = config
    const title = `${repository.branch} merge request to ${targetBranch} by ${repository.userName}`
    let repo

    try {
      repo = parseName(repository.url)
    } catch (err) {
      reject(err)
    }

    axios({
      method: 'POST',
      url: `${apiUrl}/repos/${repo.owner}/${repo.repo}/pulls`,
      headers: {
        Authorization: `token ${privateToken}`
      },
      data: {
        head: sourceBranch || repository.branch,
        base: targetBranch,
        title
      }
    })
      .then(({ data }) => {
        task.logger.info({
          name: 'merge-request',
          detail: title + ' success\n'
        })

        next(data)
      })
      .catch(error => {
        const { data, status } = error.response

        if (status === 422) {
          const msg = data.errors[0].message

          if (msg.indexOf('A pull request already exists') > -1) {
            task.logger.info({
              name: 'merge-request',
              detail: title + ' success\n' + msg + '\n'
            })
            next()
            return
          }
        }

        task.logger.error({
          name: 'merge-request',
          detail:
            'Create merge request error::' +
            (error.response.data.errors ? error.response.data.errors[0].message : error.message)
        })
        reject(error)
      })

    function next(data) {
      if (codeReview === true) {
        // 需要codeReview
        task.event.emit('message', {
          type: 'codeReview'
        })

        task.logger.info({
          name: 'merge-request',
          detail: 'request codeReview\n'
        })
      }

      if (autoMerge === true && data) {
        // 自动合并
        axios({
          method: 'PUT',
          url: `${apiUrl}/repos/${repo.owner}/${repo.repo}/pulls/${data.number}/merge`,
          headers: {
            Authorization: `token ${privateToken}`
          },
          data: {
            commit_title: `nidle auto merge`,
            commit_message: `auto accept merge request: ${title}`
          }
        })
          .then(() => {
            task.logger.info({
              name: 'merge-request',
              detail: `auto accept merge request success: ${title}\n`
            })

            removeBranch()
          })
          .catch(error => {
            task.logger.error({
              name: 'merge-request',
              detail:
                'Accept merge request error::' +
                (error.response.data.errors ? error.response.data.errors[0].message : error.message)
            })
            reject(error)
          })
      } else {
        resolve()
      }
    }

    function removeBranch() {
      if (removeSourceBranch === true) {
        // 删除远程分支
        task.logger.info({
          name: 'merge-request',
          detail: `暂未找到 github 删除分支 API，请手动删除分支.\n`
        })

        resolve()
        // axios({
        //   method: 'DELETE',
        //   url: `${apiUrl}/repos/${repo.owner}/${repo.repo}/branches/${encodeURIComponent(repository.branch)}`,
        //   headers: {
        //     Authorization: `token ${privateToken}`
        //   }
        // })
        //   .then(() => {
        //     task.logger.info({
        //       name: 'merge-request',
        //       detail: `delete remote branch: ${repository.branch}\n`
        //     })

        //     resolve()
        //   })
        //   .catch(error => {
        //     task.logger.error({
        //       name: 'merge-request',
        //       detail:
        //         'Delete remote branch error::' +
        //         (error.response.data.errors ? error.response.data.errors[0].message : error.message)
        //     })
        //     reject(error)
        //   })
      } else {
        resolve()
      }
    }
  })
}

module.exports = merge
export default merge
