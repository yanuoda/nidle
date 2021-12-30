'use strict'

// 发布记录
const Controller = require('../core/base_controller')

class ChangelogController extends Controller {
  // 开始构建任务
  async start() {
    const { ctx } = this

    try {
      const result = await ctx.service.changelog.start(ctx.request.body)

      this.success(result)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }
}

module.exports = ChangelogController
