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
      const resData = await Project.findOne({ where: { id } })
      const serverList = await this.getServer(id)
      // 获取 gitlab/github 应用成员
      const resList = await ctx.service[resData.repositoryType].getMembers(resData.repositoryUrl)
      const memberList = resList.map(item => {
        return {
          ...item,
          web_url: item.web_url || item.html_url,
          name: item.name || item.login,
          username: item.username || item.login,
          role: item.role || item.role_name
        }
      })

      return {
        ...resData.dataValues,
        serverList,
        memberList
      }
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
