'use strict'

const Service = require('egg').Service
class MessageService extends Service {
  // 发送消息
  async send(params) {
    await this.mail(params)

    return true
  }

  async mail(params) {
    const { ctx, app } = this

    if (app.mailer) {
      const config = app.mailer.config

      try {
        await app.mailer.send({
          from: config.from,
          to: params.mailer,
          subject: params.subject,
          text: params.text
        })

        return true
      } catch (err) {
        ctx.logger.error(`mailer error: \n${err.message}\n${err.stack}`)
        return true
      }
    } else {
      return true
    }
  }
}

module.exports = MessageService
