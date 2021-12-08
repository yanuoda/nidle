'use strict'

const Controller = require('../../core/base_controller')

class ProjectController extends Controller {
  // 获取应用列表
  async list() {
    const { ctx } = this
    const body = { ...ctx.request.body }
    const { current, pageSize } = body

    try {
      delete body.current
      delete body.pageSize

      const { count, rows } = await ctx.model.Project.findAndCountAll({
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

  // 获取应用详情
  async detail() {
    const { ctx } = this
    const { id } = ctx.query

    try {
      const detail = await ctx.service.project.getDetail(id)
      this.success(detail)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }

  // 保存并同步应用信息
  async sync() {
    const { ctx } = this
    const { id, ...rest } = ctx.request.body

    try {
      let res
      if (!id) {
        // 新增
        res = await ctx.model.Project.create(rest)
      } else {
        // 修改
        await ctx.model.Project.update(rest, { where: { id } })
        res = { id, name: rest.name }
      }
      // TODO: 同步 gitlab 数据
      this.success(res)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }

  // 更新应用联系人信息
  async updateContacts() {
    const { ctx } = this

    try {
      const { id, postEmails } = ctx.request.body
      const res = await ctx.model.Project.update({ postEmails }, { where: { id } })
      this.success(res)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }
}

module.exports = ProjectController
