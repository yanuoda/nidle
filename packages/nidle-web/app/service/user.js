'use strict'

const Service = require('egg').Service
const crypto = require('crypto')

class UserService extends Service {
  async find(params) {
    const { name, password, gitlabUserId } = params
    const where = name ? { name, password } : { gitlabUserId }
    const user = await this.ctx.model.Member.findOne({ where })
    return user
  }

  async registerUser(params) {
    const { name, gitlabUserId } = params
    // 默认密码为 000000
    const password = crypto.createHash('md5').update('000000').digest('hex')
    const user = await this.ctx.model.Member.create({ name, gitlabUserId, password })
    return user
  }
}

module.exports = UserService
