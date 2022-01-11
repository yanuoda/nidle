'use strict'

// 发布记录
const Controller = require('../core/base_controller')

class ChangelogController extends Controller {
  // 新建，返回配置信息
  async create() {
    const { ctx } = this

    try {
      const result = await ctx.service.changelog.create(ctx.request.body)

      this.success(result)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }

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

  // 详情
  async detail() {
    const { ctx } = this

    try {
      const result = await ctx.service.changelog.detail(ctx.request.body)

      this.success(result)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }

  // 日志
  async log() {
    const { ctx } = this

    try {
      const result = await ctx.service.changelog.log(ctx.request.body)

      this.success(result)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }
}

module.exports = ChangelogController
