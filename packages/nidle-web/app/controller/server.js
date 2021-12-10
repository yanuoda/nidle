'use strict'

const Controller = require('../core/base_controller')

class ProjectController extends Controller {
  // 获取所有的服务器列表（不包含用户名和密码）
  async index() {
    const { ctx } = this

    try {
      const servers = await ctx.service.server.getServers(ctx.request.body, { exclude: ['username', 'password'] })
      this.success(servers)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }

  // 获取服务器分页列表
  async list() {
    const { ctx } = this
    const { current, pageSize, ...body } = { ...ctx.request.body }

    try {
      const { count, rows } = await ctx.model.Server.findAndCountAll({
        where: body,
        offset: (current - 1) * pageSize,
        limit: pageSize
      })
      this.successList(rows, count)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }

  // 新增服务器
  async add() {
    const { ctx } = this

    try {
      await ctx.model.Server.create(ctx.request.body)
      this.success()
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }

  // 删除服务器
  async delete() {
    const { ctx } = this

    try {
      const { id } = ctx.request.body
      await ctx.model.Server.destroy({ where: { id } })
      this.success()
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }

  // 修改服务器
  async modify() {
    const { ctx } = this

    try {
      const { id, ...rest } = ctx.request.body
      await ctx.model.Server.update(rest, { where: { id } })
      this.success()
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }
}

module.exports = ProjectController
