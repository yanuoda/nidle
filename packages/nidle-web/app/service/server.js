'use strict'

const Service = require('egg').Service

class ServerService extends Service {
  async getServers(params = {}, attributes = {}) {
    const servers = await this.ctx.model.Server.findAll({ where: params, attributes })
    return servers
  }
}

module.exports = ServerService
