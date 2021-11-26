'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/api/oauth', controller.oauth.index)
  router.get('/api/oauth/redirect', controller.oauth.redirect)
  router.get('/api/oauth/callback', controller.oauth.oauth)

  router.get('/api/user', controller.user.index)
  router.post('/api/user/login', controller.user.login)
  router.get('/api/user/logout', controller.user.logout)

  // 配置信息
  router.post('/api/config/getByApp', controller.config.getByApp)
  router.post('/api/config/getByCreate', controller.config.getByCreate)
}
