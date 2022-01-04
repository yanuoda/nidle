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
    const { id } = ctx.query

    try {
      const detail = await ctx.service.project.getDetail(id)
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
    const { id, name, repositoryUrl: originRepoUrl, ...rest } = ctx.request.body
    const { OAUTH_GITLAB_BASEURL } = process.env
    const repositoryUrl = originRepoUrl.replace('.git', '')
    let projectName = name

    if (!name) {
      projectName = repositoryUrl.replace(`${OAUTH_GITLAB_BASEURL}/`, '')
    }

    const data = { name: projectName, repositoryUrl, ...rest }

    try {
      let res = null
      // 先获取 gitlab 项目 owner
      const gitlabProjectMembers = await ctx.service.gitlab.getMembers(repositoryUrl)
      const { username } = gitlabProjectMembers.find(member => member.access_level === 50) || {}
      if (username) {
        data.owner = username
      }

      if (!id) {
        // 新增
        res = await ctx.model.Project.create(data)
      } else {
        // 修改
        await ctx.model.Project.update(data, { where: { id } })
        res = { id, name: projectName }
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
}

module.exports = ProjectController
