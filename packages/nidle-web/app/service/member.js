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
  // 注册
  async registerUser(params) {
    const { name, gitlabUserId } = params
    const user = await this.ctx.model.Member.create({ name, gitlabUserId, password })
    return user
  }
}

module.exports = MemberService
