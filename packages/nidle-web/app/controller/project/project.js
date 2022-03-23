'use strict'

const Controller = require('../../core/base_controller')

class ProjectController extends Controller {
  // 获取应用列表
  async list() {
    const { ctx } = this
    const { current, pageSize, ...body } = ctx.request.body

    try {
      const { count, rows } = await ctx.model.Project.findAndCountAll({
        where: body,
        offset: (current - 1) * pageSize,
        limit: pageSize
      })
      this.successList(rows, count)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }

  // 获取应用详情
  async detail() {
    const { ctx } = this
    const { id, type } = ctx.query

    try {
      const detail = await ctx.service.project.getDetail(id, type)
      this.success(detail)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }

  // 保存并同步应用信息
  async sync() {
    const { ctx } = this
    const { id, name, repositoryUrl: originRepoUrl, repositoryType, ...rest } = ctx.request.body
    const repoTypeLower = repositoryType.toLocaleLowerCase()
    const BASEURL = repoTypeLower === 'gitlab' ? process.env.OAUTH_GITLAB_BASEURL : process.env.OAUTH_GITHUB_BASEURL
    const repositoryUrl = originRepoUrl.replace('.git', '')
    let projectName = name

    if (!name) {
      projectName = repositoryUrl.replace(`${BASEURL}/`, '')
    }

    const data = { name: projectName, repositoryUrl, repositoryType, ...rest }

    try {
      let res = null
      // 先获取 gitlab/github 项目 owner
      const projectMembers = await ctx.service[repoTypeLower].getMembers(repositoryUrl)
      let userList = [],
        username = ''
      if (repoTypeLower === 'gitlab') {
        username = projectMembers.find(member => member.access_level === 50)?.username
      } else {
        userList = projectMembers.filter(member => member.role_name === 'admin')
        userList.forEach(el => {
          username += `;${el.login}`
        })
      }
      if (username) {
        data.owner = username.indexOf(';') === 0 ? username.substring(username.indexOf(';') + 1) : username
      }

      if (!id) {
        // 新增
        // 先获取项目的 gitlab/github id，存储在数据库中
        const { id: github } = await ctx.service[repoTypeLower].getProjectDetail(repositoryUrl)
        if (github) {
          data.gitlabId = github
        }
        res = await ctx.model.Project.create(data)
      } else {
        // 修改
        await ctx.model.Project.update(data, { where: { id } })
        res = { id, name: projectName, repositoryType }
      }

      this.success(res)
    } catch (err) {
      const { message, stack } = err
      this.logger.error(`应用信息保存失败 >>>>>>>> \n${message}\n${stack}`)
      this.failed({
        msg: '应用信息保存失败，请重试！'
      })
    }
  }

  // 更新应用联系人信息
  async updateContacts() {
    const { ctx } = this

    try {
      const { id, postEmails } = ctx.request.body
      const res = await ctx.model.Project.update({ postEmails }, { where: { id } })
      this.success(res)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }

  // 获取项目的 gitlab/github 分支信息
  async getBranches() {
    const { ctx } = this
    const { id, type } = ctx.query
    const typeLower = type.toLocaleLowerCase()

    try {
      const { gitlabId, repositoryUrl } = await ctx.service.project.findByPk(id)
      let branches
      if (typeLower === 'gitlab') {
        branches = await ctx.service[typeLower].getBranches(gitlabId)
      } else {
        branches = await ctx.service[typeLower].getBranches(repositoryUrl)
      }
      this.success(branches)
    } catch (err) {
      console.error(err)
      this.failed({
        msg: '获取项目分支信息失败！'
      })
    }
  }
}

module.exports = ProjectController
