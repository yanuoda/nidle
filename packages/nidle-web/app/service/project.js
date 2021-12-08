'use strict'

const Service = require('egg').Service

class ProjectService extends Service {
  async getDetail(id) {
    const { ctx } = this
    const { Project, ProjectServer, ProjectMember } = ctx.model
    // 获取应用数据
    const { ...resData } = await Project.findOne({ where: { id } })
    // 获取应用服务器数据
    const projectServers = await ProjectServer.findAll({ where: { project: id } })
    const servers = await ctx.service.server.getServers({}, { exclude: ['username', 'password'] })
    const serverList = {}
    projectServers.forEach(item => {
      const { server, environment } = item
      const { name, ip } = servers.find(({ id }) => id === server)
      if (!serverList[environment]) {
        serverList[environment] = []
      }
      serverList[environment].push({
        name,
        ip,
        ...item
      })
    })
    resData.serverList = serverList
    // 获取用户数据
    const projectMembers = await ProjectMember.findAll({ where: { project: id } })
    const members = await ctx.service.member.getMembers({}, { include: ['id', 'name'] })
    resData.memberList = projectMembers.map(item => {
      const { name } = members.find(member => member.id === item.member)
      return {
        name,
        ...item
      }
    })

    return resData
  }
}

module.exports = ProjectService
