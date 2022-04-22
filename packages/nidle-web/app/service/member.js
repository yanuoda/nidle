'use strict'

const Service = require('egg').Service
const crypto = require('crypto')

// 默认密码为 000000
const password = crypto.createHash('md5').update('000000').digest('hex')

class MemberService extends Service {
  async find(params) {
    const { name, password, gitlabUserId, githubUserId } = params
    const where = name ? { name, password } : gitlabUserId ? { gitlabUserId } : { githubUserId }
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
    const { name, gitlabUserId, githubUserId } = params
    const user = await this.ctx.model.Member.create({ name, gitlabUserId, githubUserId, password, status: 0 })
    return user
  }

  // 检查用户是否在项目用户列表里
  async isProjectMember(projectId) {
    const { ctx } = this

    try {
      const { repositoryType, repositoryUrl } = await ctx.model.Project.findOne({ where: { id: projectId } })
      const user = ctx.session.user[`${repositoryType}UserId`]
      if (!user) {
        throw new Error(`未关联 ${repositoryType} 账号`)
      }
      // 获取 gitlab/github 应用成员
      const memberList = await ctx.service[repositoryType].getMembers(repositoryUrl)
      let idx
      if (repositoryType === 'github') {
        idx = memberList.findIndex(item => item.id === user && item.role_name !== 'none' && item.role_name !== 'read')
      } else {
        idx = memberList.findIndex(item => item.id === user && item.access_level > 20)
      }
      return idx > -1
    } catch (err) {
      ctx.logger.error(`service.member.isProjectMember: \n${err.message}\n${err.stack}`)
      throw err
    }
  }
}

module.exports = MemberService
