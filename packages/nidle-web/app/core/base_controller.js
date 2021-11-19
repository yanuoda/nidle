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
