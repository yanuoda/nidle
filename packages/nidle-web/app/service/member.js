'use strict'

const Service = require('egg').Service
const crypto = require('crypto')

// 默认密码为 000000
const password = crypto.createHash('md5').update('000000').digest('hex')

class MemberService extends Service {
  async find(params) {
    const { name, password, gitlabUserId } = params
    const where = name ? { name, password } : { gitlabUserId }
    const user = await this.ctx.model.Member.findOne({ where })
    return user
  }

  // 条件查找所有
  async getMembers(params = {}, attributes = {}) {
    const { ctx } = this
    const members = await ctx.model.Member.findAll({ where: params, attributes })
    return members
  }

  // 注册
  async registerUser(params) {
    const { name, gitlabUserId } = params
    const user = await this.ctx.model.Member.create({ name, gitlabUserId, password })
    return user
  }

  // 检查用户是否在项目用户列表里
  async isProjectMember(projectId) {
    const { ctx } = this

    try {
      const user = ctx.session.user.gitlabUserId
      const project = await ctx.model.Project.findOne({ where: { id: projectId } })
      const repoTypeLower = project.repositoryType.toLocaleLowerCase()
      // 获取 gitlab 应用成员
      const memberList = await ctx.service[repoTypeLower].getMembers(project.repositoryUrl)
      const idx = memberList.findIndex(item => item.id === user && item.access_level > 20)

      // return idx > -1
      // github 应用暂不做权限判断
      return repoTypeLower === 'gitlab' ? idx > -1 : true
    } catch (err) {
      ctx.logger.error(`service.member.isProjectMember: \n${err.message}\n${err.stack}`)
      throw err
    }
  }
}

module.exports = MemberService
