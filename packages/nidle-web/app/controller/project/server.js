'use strict'

const Controller = require('../../core/base_controller')

class ProjectController extends Controller {
  async add() {
    const { ctx } = this

    try {
      const res = await ctx.model.ProjectServer.create(ctx.request.body)
      this.success(res)
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
      const res = await ctx.model.ProjectServer.update({ server, output }, { where: { id } })
      this.success(res)
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
}

module.exports = ProjectController
