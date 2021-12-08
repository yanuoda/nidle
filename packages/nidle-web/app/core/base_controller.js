'use strict'

const { Controller } = require('egg')

class BaseController extends Controller {
  get user() {
    return this.ctx.session.user
  }

  success(data) {
    this.ctx.body = {
      success: true,
      data
    }
  }

  // 分页列表需要传 total
  successList(data, total) {
    this.ctx.body = {
      success: true,
      data,
      total
    }
  }

  failed(options) {
    const { data, msg, showType = 2 } = options
    this.ctx.body = {
      success: false,
      data,
      errorMessage: msg || 'unknow exception',
      showType
    }
  }

  notFound(msg) {
    msg = msg || 'not found'
    this.ctx.throw(404, msg)
  }

  setSession(key, value) {
    this.ctx.session[key] = value
  }
}
module.exports = BaseController
