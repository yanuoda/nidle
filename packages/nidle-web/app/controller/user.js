'use strict'

const Controller = require('../core/base_controller')

class UserController extends Controller {
  async index() {
    const { user } = this
    if (user) {
      this.success(user)
    } else {
      this.failed({
        msg: '请先登录！'
      })
    }
  }

  async login() {
    const { ctx } = this
    const user = await ctx.service.user.find(ctx.request.body)

    if (user) {
      const { id, name, gitlabUserId } = user
      this.setSession('user', { id, name, gitlabUserId })
      this.success(this.user)
    } else {
      this.failed({
        msg: '用户名或密码错误！'
      })
    }
  }

  async logout() {
    this.ctx.session = null
    this.success()
  }
}

module.exports = UserController
