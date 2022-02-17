'use strict'

const Service = require('egg').Service

// 发布数据转换方法
const publishDataTransform = data => {
  // 首先聚合同个发布周期的数据
  const periodMap = Object.create(null)
  data.forEach(item => {
    const { period } = item
    if (!periodMap[period]) {
      periodMap[period] = []
    }
    periodMap[period].push(item)
  })
  // 然后同个发布周期的数据按照发布开始时间倒序排序
  for (const period in periodMap) {
    periodMap[period].sort((first, second) => {
      return new Date(second.createdTime).getTime() - new Date(first.createdTime).getTime()
    })
  }
  // 对所有发布做开始时间倒序排序
  const publishEnvMap = Object.create(null)
  Object.entries(periodMap).forEach(item => {
    const periodItem = item[1]
    const env = periodItem[0].environment
    if (!publishEnvMap[env]) {
      publishEnvMap[env] = []
    }
    publishEnvMap[env].push(periodItem)
  })
  for (const env in publishEnvMap) {
    // 转换成前端 table 需要的格式
    publishEnvMap[env] = publishEnvMap[env]
      .map(item => {
        if (item.length > 1) {
          const [parent, ...children] = item
          children.forEach(child => {
            // 标识 child
            child.isChild = true
            delete child.branch
          })
          return [{ ...parent, children }]
        } else {
          return item
        }
      })
      .flat()
      .sort((first, second) => {
        return new Date(second.updatedTime).getTime() - new Date(first.updatedTime).getTime()
      })
  }
  return publishEnvMap
}

class PublishService extends Service {
  // 获取项目下的所有发布数据
  async getPublishList(projectId) {
    const { ctx, app } = this
    const { Op } = app.Sequelize
    // 获取项目下的所有发布
    const list = await ctx.model.Changelog.findAll({ where: { project: projectId }, raw: true })
    // 获取项目信息
    const currentProject = await ctx.service.project.findByPk(projectId)
    const { repositoryUrl } = currentProject
    // 获取开发人员信息
    const members = await ctx.service.member.getMembers(
      { id: { [Op.in]: [...new Set(list.map(item => item.developer))] } },
      { include: ['id', 'name'] }
    )

    list.forEach(item => {
      const { developer, commitId } = item
      // 开发者信息
      const currentDeveloper = members.find(member => member.id === developer)
      const name = currentDeveloper?.name || developer

      item.developer = name
      item.commitUrl = `${repositoryUrl}/commit/${commitId}`
    })
    const publishListMap = publishDataTransform(list)
    for (const env in publishListMap) {
      publishListMap[env].forEach(changelog => {
        const next = ctx.helper.nidleNext(changelog)
        changelog.nextPublish = next
      })
    }

    return publishListMap
  }
}

module.exports = PublishService
