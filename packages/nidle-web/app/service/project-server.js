'use strict'

const Service = require('egg').Service

class ProjectServerService extends Service {
  // 获取应用服务器
  async getProjectServers(params = {}, attributes = {}) {
    const { ctx } = this
    const { ProjectServer } = ctx.model

    const resData = await ProjectServer.findAll({ where: params, attributes })
    return resData
  }
}

module.exports = ProjectServerService
