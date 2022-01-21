'use strict'

const Controller = require('../core/base_controller')

class TemplateController extends Controller {
  async index() {
    const { ctx } = this

    try {
      const template = await this.ctx.model.Template.findByPk(ctx.request.body.id)
      this.success(template)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }

  // 获取配置模板分页列表
  async list() {
    const { ctx } = this
    const { current, pageSize, ...body } = ctx.request.body
    // 剔除为空的查询参数
    for (const key in body) {
      if (Object.hasOwnProperty.call(body, key)) {
        if (!body[key]) {
          delete body[key]
        }
      }
    }
    try {
      const { count, rows } = await ctx.model.Template.findAndCountAll({
        where: body,
        offset: (current - 1) * pageSize,
        limit: pageSize
      })
      this.successList(rows, count)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }

  // 新增配置模板
  async add() {
    const { ctx } = this

    try {
      const { id, name } = await ctx.model.Template.create(ctx.request.body)
      this.success({ id, name })
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }

  // 删除配置模板
  async delete() {
    const { ctx } = this

    try {
      const { id } = ctx.request.body
      await ctx.model.Template.destroy({ where: { id } })
      this.success()
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }

  // 修改配置模板
  async modify() {
    const { ctx } = this

    try {
      const { id, ...rest } = ctx.request.body
      await ctx.model.Template.update(rest, { where: { id } })
      this.success({ id, name: rest.name })
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }
}

module.exports = TemplateController
