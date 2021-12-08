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
  router.get('/api/user', controller.user.index)
  router.post('/api/user/login', controller.user.login)
  router.get('/api/user/logout', controller.user.logout)

  // 配置信息
  router.post('/api/config/getByApp', controller.config.getByApp)
  router.post('/api/config/getByCreate', controller.config.getByCreate)

  // 服务器
  router.post('/api/server', controller.server.index)
  // input
  router.post('/api/config/getInput', controller.config.getInput)
  router.post('/api/config/setInput', controller.config.setInput)
}
