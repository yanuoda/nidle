'use strict'

const Controller = require('../core/base_controller')

class ProjectController extends Controller {
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
}

module.exports = ProjectController
