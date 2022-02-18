'use strict'

const Controller = require('../../core/base_controller')

class ProjectServerController extends Controller {
  async add() {
    const { ctx } = this

    try {
      // TODO: 校验
      // 直接在create上include没生效
      const res = await ctx.model.ProjectServer.create(ctx.request.body)
      const result = await ctx.model.ProjectServer.findOne({
        where: {
          id: res.id
        },
        include: [
          {
            model: ctx.model.Server,
            as: 'Server',
            attributes: ['name', 'ip', 'description', 'status']
          }
        ]
      })
      this.success(result)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }

  async modify() {
    const { ctx } = this

    try {
      const { id, server, output } = ctx.request.body
      await ctx.model.ProjectServer.update({ server, output }, { where: { id } })
      const result = await ctx.model.ProjectServer.findOne({
        where: { id },
        include: [
          {
            model: ctx.model.Server,
            as: 'Server',
            attributes: ['name', 'ip', 'description', 'status']
          }
        ]
      })
      this.success(result)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }

  async delete() {
    const { ctx } = this

    try {
      const { id } = ctx.request.body
      await ctx.model.ProjectServer.destroy({ where: { id } })
      this.success()
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }

  // 获取项目指定环境服务器列表
  async getServer() {
    const { ctx } = this

    try {
      const { id, mode } = ctx.request.body
      const result = await ctx.service.project.getServer(id, mode)
      this.success(result)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }
}

module.exports = ProjectServerController
