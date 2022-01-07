'use strict'

const Controller = require('../../core/base_controller')

class PublishController extends Controller {
  // 获取应用发布列表
  async list() {
    const { ctx } = this
    const { id } = ctx.query

    try {
      const data = await ctx.service.publish.getPublishList(id)
      this.success(data)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }
}

module.exports = PublishController
