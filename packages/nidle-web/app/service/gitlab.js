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
    return this.ctx.curl(`${OAUTH_GITLAB_BASEURL}/api/v4${url}`, {
      method,
      data: params,
      headers: {
        'PRIVATE-TOKEN': GITLAB_PRIVATE_TOKEN,
        ...headers
      },
      dataType: 'json',
      ...rest
    })
  }

  // 获取应用成员
  async getMembers(projectUrl) {
    const projectPath = projectUrl.replace(`${OAUTH_GITLAB_BASEURL}/`, '')
    const group = projectPath.split('/').length === 2 ? projectPath.split('/')[0] : null
    const id = encodeURIComponent(projectPath)
    let groupMembers = []

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

    const members = [...(projectMembers?.data || []), ...(groupMembers?.data || [])].map(member => {
      return {
        role: accessLevelMap[member.access_level],
        ...member
      }
    })
    return members
  }

  // 获取某个项目的信息
  async getProjectDetail(projectUrl) {
    const projectPath = projectUrl.replace(`${OAUTH_GITLAB_BASEURL}/`, '')
    const id = encodeURIComponent(projectPath)

    const project = await this.gitlabRequest({
      url: `/projects/${id}`,
      method: 'GET'
    })

    return project?.data || {}
  }

  // 获取项目分支信息
  async getBranches(projectGitlabId) {
    const branches = await this.gitlabRequest({
      url: `/projects/${projectGitlabId}/repository/branches`,
      method: 'GET'
    })

    return branches?.data || {}
  }
}

module.exports = GitlabService
