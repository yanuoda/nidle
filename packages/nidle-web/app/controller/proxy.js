const Controller = require('egg').Controller

class ProxyController extends Controller {
  async static() {
    const { ctx } = this

    console.log(1111, ctx)
  }
}

module.exports = ProxyController
