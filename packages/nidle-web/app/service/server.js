'use strict'

const Service = require('egg').Service

class ServerService extends Service {
  async getServers(params = {}, attributes = {}) {
    const servers = await this.ctx.model.Server.findAll({ where: params, attributes })
    return servers
  }

  async getDetail(id) {
    const { ctx } = this
    const { Server } = ctx.model
    // 获取应用数据
    const { ...resData } = await Server.findOne({ where: { id } })
    return resData
  }
}

module.exports = ServerService
