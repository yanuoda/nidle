const axios = require('axios')

function merge(task, config) {
  return new Promise((resolve, reject) => {
    const { repository } = task
    const { apiUrl, privateToken, sourceBranch, targetBranch, codeReview, autoMerge, removeSourceBranch } = config
    const title = `${repository.branch} merge request to ${targetBranch} by ${repository.userName}`

    axios({
      method: 'POST',
      url: `${apiUrl}/projects/${repository.id}/merge_requests`,
      headers: {
        'PRIVATE-TOKEN': privateToken
      },
      data: {
        id: repository.id,
        source_branch: sourceBranch || repository.branch,
        target_branch: targetBranch,
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
        const msg = error.response.data.message ? error.response.data.message[0] : error.message

        if (msg.indexOf('merge request already exists') > -1) {
          task.logger.info({
            name: 'merge-request',
            detail: title + ' success\n' + msg + '\n'
          })
          next()
          return
        }

        task.logger.error({
          name: 'merge-request',
          detail: 'Create merge request error::' + msg
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
          url: `${apiUrl}/projects/${repository.id}/merge_requests/${data.iid}/merge`,
          headers: {
            'PRIVATE-TOKEN': privateToken
          },
          data: {
            id: repository.id,
            merge_request_iid: data.iid,
            merge_commit_message: `auto accept merge request: ${title}`
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
                (error.response.data.message ? error.response.data.message : error.message)
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
        axios({
          method: 'DELETE',
          url: `${apiUrl}/projects/${repository.id}/repository/branches/${encodeURIComponent(repository.branch)}`,
          headers: {
            'PRIVATE-TOKEN': privateToken
          }
        })
          .then(() => {
            task.logger.info({
              name: 'merge-request',
              detail: `delete remote branch: ${repository.branch}\n`
            })

            resolve()
          })
          .catch(error => {
            task.logger.error({
              name: 'merge-request',
              detail: 'Delete remote branch error::' + error.message
            })
            reject(error)
          })
      } else {
        resolve()
      }
    }
  })
}

module.exports = merge
export default merge
