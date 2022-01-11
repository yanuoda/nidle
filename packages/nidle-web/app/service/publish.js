'use strict'

const Service = require('egg').Service

// 发布数据转换方法
const publishDataTransform = (data, globalData) => {
  // 按时间倒序排序
  const handleSort = (first, second) => {
    return new Date(second.updatedTime).getTime() - new Date(first.updatedTime).getTime()
  }
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
    periodMap[period].sort(handleSort)
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
    publishEnvMap[env].sort(handleSort)
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
      .flat(Infinity)

    /** 判断当前发布是否可以继续进行发布 */
    const { environmentList } = globalData || { environmentList: [] }
    const envListLen = environmentList.length
    publishEnvMap[env].forEach((item, idx) => {
      const { serverInfo, status, environment } = item
      const { ip, output } = serverInfo
      const firstIndex = publishEnvMap[env].findIndex(
        ({ serverInfo: server }) => server.ip === ip && server.output === output
      )
      const currentEnvIdx = environmentList.findIndex(env => env.key === environment)

      if (firstIndex === idx && status === 1 && currentEnvIdx < envListLen - 1) {
        // 当前指定机器和目录下最新的发布
        item.canPublish = true
      }
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
    const list = await ctx.model.Changelog.findAll({ where: { project: projectId } })
    // 获取项目信息
    const currentProject = await ctx.service.project.findByPk(projectId)
    const { repositoryUrl } = currentProject
    // 获取开发人员信息
    const members = await ctx.service.member.getMembers(
      { gitlabUserId: { [Op.in]: [...new Set(list.map(item => item.developer))] } },
      { include: ['name', 'gitlabUserId'] }
    )

    list.forEach(item => {
      const { developer, commitId } = item
      // TODO: 获取服务器信息
      const ip = '0.0.0.0'
      const output = '/test'
      // 开发者信息
      const currentDeveloper = members.find(member => member.gitlabUserId === developer)
      const name = currentDeveloper?.name || developer

      item.serverInfo = { ip, output }
      item.developer = name
      item.commitUrl = `${repositoryUrl}/commit/${commitId}`
    })
    return publishDataTransform(list, app.globalData)
  }
}

module.exports = PublishService
