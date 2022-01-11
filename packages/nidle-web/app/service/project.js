'use strict'

const Service = require('egg').Service

class ProjectService extends Service {
  // 根据主键获取单个项目信息
  async findByPk(id) {
    const project = await this.ctx.model.Project.findByPk(id)
    return project
  }

  // 获取应用详情信息
  async getDetail(id) {
    const { ctx } = this
    const { Project } = ctx.model

    try {
      // 获取应用数据
      const resData = await Project.findOne({ where: { id }, raw: true })
      const serverList = await this.getServer(id)
      // 获取 gitlab 应用成员
      const memberList = await ctx.service.gitlab.getMembers(resData.repositoryUrl)
      resData.serverList = serverList
      resData.memberList = memberList

      return resData
    } catch (err) {
      console.log(333, err)
      throw err
    }
  }

  async getBaseinfo(id) {
    const { ctx } = this
    const { Project } = ctx.model

    return await Project.findOne({ where: { id } })
  }

  async getServer(id, mode = '') {
    const { Server, ProjectServer } = this.ctx.model

    try {
      // 获取应用服务器数据
      const params = {
        project: id
      }

      if (mode) {
        params.environment = mode
      }

      const projectServers = await ProjectServer.findAll({
        where: params,
        include: [
          {
            model: Server,
            as: 'Server',
            attributes: ['name', 'ip', 'description', 'status']
          }
        ]
      })

      if (!mode) {
        const serverList = {}
        projectServers.forEach(item => {
          const { environment } = item
          if (!serverList[environment]) {
            serverList[environment] = []
          }
          serverList[environment].push(item)
        })
        return serverList
      }

      return projectServers
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}

module.exports = ProjectService
