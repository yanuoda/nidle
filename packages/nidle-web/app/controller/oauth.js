'use strict'

const Controller = require('../core/base_controller')

const {
  OAUTH_GITLAB_BASEURL,
  OAUTH_GITLAB_REDIRECT_URI,
  OAUTH_GITLAB_CLIENT_ID,
  OAUTH_GITLAB_SCOPE,
  OAUTH_GITLAB_CLIENT_SECRET,
  OAUTH_GITHUB_APIURL,
  OAUTH_GITHUB_BASEURL,
  OAUTH_GITHUB_CLIENT_ID,
  OAUTH_GITHUB_CLIENT_SECRET,
  OAUTH_GITHUB_SCOPE
} = process.env

class OAuthController extends Controller {
  async index() {
    const { ctx } = this
    console.log(ctx.query.type)
    if (ctx.query.type === 'github') {
      ctx.redirect(
        `${OAUTH_GITHUB_BASEURL}/login/oauth/authorize?client_id=${OAUTH_GITHUB_CLIENT_ID}&scope=${OAUTH_GITHUB_SCOPE}&state=1`
      )
    } else {
      ctx.redirect(
        `${OAUTH_GITLAB_BASEURL}/oauth/authorize?client_id=${OAUTH_GITLAB_CLIENT_ID}&redirect_uri=${OAUTH_GITLAB_REDIRECT_URI}&response_type=code&scope=${OAUTH_GITLAB_SCOPE}`
      )
    }
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
          Authorization: `Bearer ${tokenRes?.data?.access_token}`
        },
        dataType: 'json'
      })
      // 查找 or 注册用户
      const { id: gitlabUserId, username: name } = userInfo?.data || {}
      let currentUser = await ctx.service.member.find({ gitlabUserId })
      if (!currentUser) {
        currentUser = await ctx.service.member.registerUser({ name, gitlabUserId })
      }
      console.log('currentUser >>>>> ', currentUser)
      // session
      const { id } = currentUser
      ctx.session.user = { id, name, gitlabUserId }
    } catch (err) {
      console.log('GitLab OAuth failed >>>>> \n')
      console.error(err)
      console.log()
      ctx.logger.error(new Error('GitLab OAuth failed >>>>> ', err.message))
    }
    ctx.redirect('/api/oauth/redirect')
  }

  async githubOauth() {
    const { ctx } = this
    const { code } = ctx.query

    const params = {
      client_id: OAUTH_GITHUB_CLIENT_ID,
      client_secret: OAUTH_GITHUB_CLIENT_SECRET,
      code
    }
    try {
      // 获取 access token
      const tokenRes = await ctx.curl(`${OAUTH_GITHUB_BASEURL}/login/oauth/access_token`, {
        method: 'POST',
        data: params,
        dataType: 'json'
      })
      // 获取 gitlab 用户信息
      const userInfo = await ctx.curl(`${OAUTH_GITHUB_APIURL}/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenRes?.data?.access_token}`
        },
        dataType: 'json'
      })
      const { id: githubUserId, login: name } = userInfo?.data || {}
      const gitlabUserId = ctx?.session?.user?.gitlabUserId
      // 关联 gitlab 账号
      console.log('当前是否已登录 gitlab 账号 -- >> ', gitlabUserId)
      if (gitlabUserId) {
        const hasGlUser = await ctx.service.member.find({ gitlabUserId })
        if (hasGlUser && hasGlUser.status === 0) {
          console.log('ok')
          await ctx.model.Member.update(
            { githubUserId, status: 1 },
            {
              where: { gitlabUserId }
            }
          )
        }
        return
      }
      // 查找 or 注册用户
      let currentUser = await ctx.service.member.find({ githubUserId })
      if (!currentUser) {
        currentUser = await ctx.service.member.registerUser({ name, githubUserId })
      }
      console.log('currentUser >>>>> ', currentUser)
      // session
      const { id } = currentUser
      ctx.session.user = { id, name, githubUserId }
    } catch (err) {
      console.log('GitHub OAuth failed >>>>> \n')
      console.error(err)
      console.log()
      ctx.logger.error(new Error('GitHub OAuth failed >>>>> ', err.message))
    }
    ctx.redirect('/api/oauth/redirect')
  }
}

module.exports = OAuthController
