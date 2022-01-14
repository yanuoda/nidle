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

  // 取消占用服务器
  async cancelUsed(changelogId) {
    const { ctx } = this

    try {
      const servers = await ctx.model.ProjectServer.findAll({ where: { changelog: changelogId } })

      if (servers.length) {
        for (let i = 0, len = servers.length; i < len; i++) {
          await ctx.model.ProjectServer.update({ changelog: null }, { where: { id: servers[i].id } })
        }
      }

      return true
    } catch (err) {
      ctx.logger.error(`取消占用服务器: \n${err.message}\n${err.stack}`)
      throw err
    }
  }
}

module.exports = ProjectServerService
