'use strict'

// 配置信息

const Controller = require('../core/base_controller')

class ConfigController extends Controller {
  /**
   * 获取应用对应环境配置 #swagger-api
   *
   * @function get
   * @memberof ConfigController
   * @description #consumes application/x-www-form-urlencoded
   * @description #produces application/json
   * @description #parameters configInfo body schema.config.get true - parameter configInfo
   * @description #responses 200 {} - config
   */
  async getByApp() {
    const { ctx } = this

    try {
      const result = await ctx.service.config.getByApp(ctx.request.body)

      this.success(result)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }

  // 发布时获取对应环境配置
  async getByCreate() {
    const { ctx } = this

    try {
      const result = await ctx.service.config.getByCreate(ctx.request.body)

      this.success(result)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }
}

module.exports = ConfigController
