'use strict'

const Controller = require('../core/base_controller')

const {
  OAUTH_GITLAB_BASEURL,
  OAUTH_GITLAB_REDIRECT_URI,
  OAUTH_GITLAB_CLIENT_ID,
  OAUTH_GITLAB_SCOPE,
  OAUTH_GITLAB_CLIENT_SECRET
} = process.env

class OAuthController extends Controller {
  async index() {
    const { ctx } = this

    ctx.redirect(
      `${OAUTH_GITLAB_BASEURL}/oauth/authorize?client_id=${OAUTH_GITLAB_CLIENT_ID}&redirect_uri=${OAUTH_GITLAB_REDIRECT_URI}&response_type=code&scope=${OAUTH_GITLAB_SCOPE}`
    )
  }

  async redirect() {
    const { ctx } = this
    const { FE_SUCCESS_CALLBACK, FE_FAILED_CALLBACK } = process.env
    const type = ctx?.session?.user ? 'success' : 'failed'
    await ctx.render('oauth.nj', {
      FECallbackURL: type === 'success' ? FE_SUCCESS_CALLBACK : FE_FAILED_CALLBACK,
      type
    })
  }

  async oauth() {
    const { ctx } = this
    const { code } = ctx.query

    const params = {
      client_id: OAUTH_GITLAB_CLIENT_ID,
      client_secret: OAUTH_GITLAB_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: OAUTH_GITLAB_REDIRECT_URI
    }
    try {
      // 获取 access token
      const tokenRes = await ctx.curl(`${OAUTH_GITLAB_BASEURL}/oauth/token`, {
        method: 'POST',
        data: params,
        dataType: 'json'
      })
      // 获取 gitlab 用户信息
      const userInfo = await ctx.curl(`${OAUTH_GITLAB_BASEURL}/api/v4/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenRes.data.access_token}`
        },
        dataType: 'json'
      })
      // 查找 or 注册用户
      const { id: gitlabUserId, username: name } = userInfo?.data || {}
      let currentUser = await ctx.service.user.find({ gitlabUserId })
      if (!currentUser) {
        currentUser = await ctx.service.user.registerUser({ name, gitlabUserId })
      }
      console.log('currentUser >>>>> ', currentUser)
      // session
      const { id } = currentUser
      ctx.session.user = { id, name, gitlabUserId }
    } catch (err) {
      ctx.logger.error(new Error('GitLab OAuth failed >>>>> ', err.message))
    }
    ctx.redirect('/api/oauth/redirect')
  }
}

module.exports = OAuthController
