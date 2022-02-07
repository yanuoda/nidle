'use strict'

const Service = require('egg').Service

const { OAUTH_GITLAB_BASEURL, GITLAB_PRIVATE_TOKEN } = process.env
const accessLevelMap = {
  10: 'Guest',
  20: 'Reporter',
  30: 'Developer',
  40: 'Maintainer',
  50: 'Owner'
}

class GitlabService extends Service {
  /**
   * gitlab 请求封装
   */
  async gitlabRequest(options) {
    const { url, method, params, headers, ...rest } = options
    const { data, status } = await this.ctx.curl(`${OAUTH_GITLAB_BASEURL}/api/v4${url}`, {
      method,
      data: params,
      headers: {
        'PRIVATE-TOKEN': GITLAB_PRIVATE_TOKEN,
        ...headers
      },
      dataType: 'json',
      ...rest
    })

    if (status === 200) {
      return data
    }

    throw new Error(data.message)
  }

  // 获取应用成员
  async getMembers(projectUrl) {
    const projectPath = projectUrl.replace(`${OAUTH_GITLAB_BASEURL}/`, '')
    const group = projectPath.split('/').length === 2 ? projectPath.split('/')[0] : null
    const id = encodeURIComponent(projectPath)

    let groupMembers = []

    try {
      const projectMembers = await this.gitlabRequest({
        url: `/projects/${id}/members`,
        method: 'GET'
      })
      if (group) {
        groupMembers = await this.gitlabRequest({
          url: `/groups/${group}/members`,
          method: 'GET'
        })
      }

      const members = [...(projectMembers || []), ...(groupMembers || [])].map(member => {
        return {
          role: accessLevelMap[member.access_level],
          ...member
        }
      })
      return members
    } catch (err) {
      throw err
    }
  }

  async getFile(id, branch, filePath) {
    try {
      return await this.gitlabRequest({
        url: `/projects/${id}/repository/files/${encodeURIComponent(filePath)}/raw?ref=${branch}`,
        method: 'GET'
      })
    } catch (err) {
      throw err
    }
  }

  // 获取某个项目的信息
  async getProjectDetail(projectUrl) {
    const projectPath = projectUrl.replace(`${OAUTH_GITLAB_BASEURL}/`, '')
    const id = encodeURIComponent(projectPath)

    return await this.gitlabRequest({
      url: `/projects/${id}`,
      method: 'GET'
    })
  }

  // 获取项目分支信息
  async getBranches(projectGitlabId) {
    return await this.gitlabRequest({
      url: `/projects/${projectGitlabId}/repository/branches`,
      method: 'GET'
    })
  }

  async getBranch(id, branch) {
    return await this.gitlabRequest({
      url: `/projects/${id}/repository/branches/${encodeURIComponent(branch)}`,
      method: 'GET'
    })
  }
}

module.exports = GitlabService
