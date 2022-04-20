'use strict'

const Controller = require('../core/base_controller')

class UserController extends Controller {
  async index() {
    const { user, ctx } = this
    console.log('ctx user --> ', ctx.session)
    console.log('user --> ', user)
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
    console.log('login ctx.session -> ', ctx.session)

    try {
      const user = await ctx.service.member.find(ctx.request.body)

      if (user) {
        const { id, name, gitlabUserId } = user
        this.setSession('user', { id, name, gitlabUserId })
        this.success(this.user)
      } else {
        this.failed({
          msg: '用户名或密码错误！'
        })
      }
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }

  async logout() {
    this.ctx.session = null
    this.success()
  }

  async modifyPassword() {
    const { ctx, user } = this
    const { oldPassword, newPassword } = ctx.request.body

    try {
      const { password } = await ctx.model.Member.findOne({
        where: { id: user?.id },
        attributes: ['password']
      })
      if (oldPassword !== password) {
        this.failed({
          msg: '旧密码输入错误，请重新输入！'
        })
        return
      }
      await ctx.model.Member.update({ password: newPassword }, { where: { id: user?.id } })
      this.logout()
    } catch (err) {
      this.logger.error(err)
      this.failed({
        msg: '密码修改失败，请稍后重试！'
      })
    }
  }
}

module.exports = UserController
