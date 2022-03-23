'use strict'

const Service = require('egg').Service

const { OAUTH_GITHUB_BASEURL, OAUTH_GITHUB_APIURL, GITHUB_PRIVATE_TOKEN } = process.env

class GithubService extends Service {
  /**
   * github 请求封装
   */
  async githubRequest(options) {
    const { url, method, params, headers, dataType = 'json', ...rest } = options
    const { data, status } = await this.ctx.curl(`${OAUTH_GITHUB_APIURL}${url}`, {
      method,
      data: params,
      headers: {
        Authorization: `token ${GITHUB_PRIVATE_TOKEN}`,
        ...headers
      },
      dataType,
      ...rest
    })
    if (status === 200) {
      return data
    }

    let message = data.message

    if (dataType === 'text') {
      message = JSON.parse(data).message
    }

    throw new Error(message)
  }

  splitUrl(url) {
    const projectPath = url.replace(`${OAUTH_GITHUB_BASEURL}/`, '')
    const owner = projectPath.split('/').length ? projectPath.split('/')[0] : null
    const repo = projectPath.split('/').length >= 2 ? projectPath.split('/')[1] : null

    return {
      owner,
      repo
    }
  }

  // 获取应用成员
  async getMembers(projectUrl) {
    const url = this.splitUrl(projectUrl)

    try {
      return await this.githubRequest({
        url: `/repos/${url.owner}/${url.repo}/collaborators`, // 协作成员
        // url: `/repos/${owner}/${repo}/contributors`, // 贡献成员
        method: 'GET'
      })
    } catch (err) {
      throw err
    }
  }

  async getFile(projectUrl, filePath, branch) {
    const url = this.splitUrl(projectUrl)

    try {
      return await this.githubRequest({
        url: `/repos/${url.owner}/${url.repo}/contents/${filePath}?ref=${branch}`,
        method: 'GET',
        dataType: 'text',
        headers: {
          Accept: 'application/vnd.github.v3.raw+json'
        }
      })
    } catch (err) {
      throw err
    }
  }

  // 获取某个项目的信息
  async getProjectDetail(projectUrl) {
    const url = this.splitUrl(projectUrl)

    return await this.githubRequest({
      url: `/repos/${url.owner}/${url.repo}`,
      method: 'GET'
    })
  }

  // 获取项目分支信息
  async getBranches(projectUrl) {
    const url = this.splitUrl(projectUrl)

    return await this.githubRequest({
      url: `/repos/${url.owner}/${url.repo}/branches`,
      method: 'GET'
    })
  }

  async getBranch(projectUrl, branch) {
    const url = this.splitUrl(projectUrl)

    return await this.githubRequest({
      url: `/repos/${url.owner}/${url.repo}/branches/${branch}`,
      method: 'GET'
    })
  }
}

module.exports = GithubService
