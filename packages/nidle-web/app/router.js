'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  // 授权登录
  router.get('/api/oauth', controller.oauth.index)
  router.get('/api/oauth/redirect', controller.oauth.redirect)
  router.get('/api/oauth/callback', controller.oauth.oauth)

  // 用户
  router.get('/api/user', controller.member.index)
  router.post('/api/user/login', controller.member.login)
  router.get('/api/user/logout', controller.member.logout)

  // 配置信息
  router.post('/api/config/getByApp', controller.config.getByApp)
  router.post('/api/config/getByCreate', controller.config.getByCreate)

  // 服务器
  router.post('/api/server', controller.server.index)
  router.post('/api/server/list', controller.server.list)
  router.post('/api/server/add', controller.server.add)
  router.post('/api/server/delete', controller.server.delete)
  router.post('/api/server/modify', controller.server.modify)

  // input
  router.post('/api/config/getInput', controller.config.getInput)
  router.post('/api/config/setInput', controller.config.setInput)

  // 应用
  router.post('/api/project/list', controller.project.project.list)
  router.get('/api/project/detail', controller.project.project.detail)
  router.post('/api/project/sync', controller.project.project.sync)
  router.post('/api/project/contacts/update', controller.project.project.updateContacts)
  router.post('/api/project/server/add', controller.project.server.add)
  router.post('/api/project/server/modify', controller.project.server.modify)
  router.post('/api/project/server/delete', controller.project.server.delete)

  // 发布记录
  router.post('/api/changelog/start', controller.changelog.start)
}
