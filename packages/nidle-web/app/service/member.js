'use strict'

const Service = require('egg').Service

class MemberService extends Service {
  async getMembers(params = {}, attributes = {}) {
    const members = await this.ctx.model.Member.findAll({ where: params, attributes })
    return members
  }
}

module.exports = MemberService
