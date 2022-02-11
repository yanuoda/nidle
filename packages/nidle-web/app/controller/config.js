'use strict'

// 配置信息
const NildeChain = require('nidle-chain')
const _ = require('lodash')
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
      const config = await ctx.service.config.getByApp(ctx.request.body)

      // 有chain，处理chain
      if (config.chain && _.isFunction(config.chain)) {
        const chainFun = config.chain
        delete config.chain

        const newConfig = new NildeChain()
        newConfig.merge(config)
        chainFun(newConfig)
        this.success(newConfig.toConfig())
        return
      }

      this.success(config)
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

  // 获取配置插件input
  async getInput() {
    const { ctx } = this

    try {
      const result = await ctx.service.config.getInput(ctx.request.body)

      this.success(result)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }

  // 提交inputs
  async setInput() {
    const { ctx } = this

    try {
      const result = await ctx.service.config.setInput(ctx.request.body)
      this.success(result)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }
}

module.exports = ConfigController
