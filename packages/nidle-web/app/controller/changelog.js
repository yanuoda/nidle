'use strict'

// 发布记录
const Controller = require('../core/base_controller')

class ChangelogController extends Controller {
  // 新建，返回配置信息
  async create() {
    const { ctx } = this
    const { id, type, mode, projectId } = ctx.request.body

    try {
      // 检查是否有权限
      const isProjectMember = await ctx.service.member.isProjectMember(projectId)

      if (!isProjectMember) {
        this.failed({
          msg: '您没有该应用权限，不能进行此操作'
        })
        return
      }

      // 检查是否能进入下一阶段
      if (type === 'normal') {
        const changelog = id ? await ctx.model.Changelog.findOne({ where: { id } }) : null
        const next = ctx.helper.nidleNext(changelog, mode)

        if (next.next !== 'CREATE' || next.environment.value !== mode) {
          this.failed({
            data: next,
            msg: `请检查发布状态，暂时不能进入${mode}发布`
          })
          return
        }
      }

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
    const { id } = ctx.request.body

    try {
      const changelog = await ctx.model.Changelog.findOne({ where: { id } })
      // 检查是否有权限
      const isProjectMember = await ctx.service.member.isProjectMember(changelog.project)

      if (!isProjectMember) {
        this.failed({
          msg: '您没有该应用权限，不能进行此操作'
        })
        return
      }

      const result = await ctx.service.changelog.start(ctx.request.body)

      this.success(result)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }

  // 退出发布
  async quit() {
    const { ctx } = this
    const { id } = ctx.request.body

    try {
      const changelog = await ctx.model.Changelog.findOne({ where: { id } })
      // 检查是否有权限
      const isProjectMember = await ctx.service.member.isProjectMember(changelog.project)

      if (!isProjectMember) {
        this.failed({
          msg: '您没有该应用权限，不能进行此操作'
        })
        return
      }

      const result = await ctx.service.changelog.quit(ctx.request.body)

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

  // merge hook
  async mergeAccept() {
    const { ctx } = this

    try {
      const result = await ctx.service.changelog.mergeAccept(ctx.request.body)

      this.success(result)
    } catch (err) {
      this.failed({
        msg: err.message
      })
    }
  }
}

module.exports = ChangelogController
