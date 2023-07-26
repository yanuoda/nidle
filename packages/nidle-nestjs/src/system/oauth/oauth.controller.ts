import { Response } from 'express';
import { Controller, Get, Query, Res, Render, Session } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService, ConfigType } from '@nestjs/config';
// import { registerHelper } from 'hbs';

import { oauthConfig } from 'src/configuration';
import { SessionDto } from 'src/common/base.dto';
import { OauthService } from './oauth.service';
import { CallbackQueryDto, IndexDto } from './oauth.dto';

@ApiTags('oauth相关接口')
@Controller('oauth')
export class OauthController {
  _oauthConfig: ConfigType<typeof oauthConfig>;
  constructor(
    private readonly configService: ConfigService,
    private readonly oauthService: OauthService,
  ) {
    this._oauthConfig = this.configService.get('oauthConfig');
  }

  @ApiOperation({ summary: '跳转站点' })
  @Get()
  async index(@Query() { type }: IndexDto, @Res() response: Response) {
    if (type === 'gitlab') {
      response.redirect(
        `${this._oauthConfig.gitlab.baseUrl}/oauth/authorize
          ?client_id=${this._oauthConfig.gitlab.clientId}
          &redirect_uri=${this._oauthConfig.gitlab.redirectUri}
          &response_type=code&scope=${this._oauthConfig.gitlab.scope}
        `,
      );
    } else {
      /** @todo github */
      // response.redirect(
      //   `${OAUTH_GITHUB_BASEURL}/login/oauth/authorize?client_id=${OAUTH_GITHUB_CLIENT_ID}&scope=${OAUTH_GITHUB_SCOPE}&state=1`,
      // );
    }
  }

  @ApiOperation({ summary: '授权登录、关联后重定向' })
  @Get('redirect')
  @Render('redirect')
  async redirect(@Session() session: SessionDto) {
    const type = session?.user ? 'success' : 'failed';
    // registerHelper()
    let text = '';
    if (type === 'success') {
      text = '登录成功，跳转中...';
    } else if (type === 'failed') {
      text = '登录失败，正在跳转回登录页...';
    }
    // else if (type === 'rela_success') {
    //   text = '关联成功，跳转中...';
    // } else if (type === 'rela_failed') {
    //   text = '关联失败，跳转中...';
    // }
    return {
      text,
      FECallbackURL:
        type === 'success'
          ? this._oauthConfig.redirectBack.success
          : this._oauthConfig.redirectBack.failed,
    };
  }

  @ApiOperation({ summary: '授权登录' })
  @Get('callback')
  async callback(
    @Query() { code }: CallbackQueryDto,
    @Session() session: SessionDto,
    @Res() response: Response,
  ) {
    const { id, name, gitlabUserId, githubUserId } =
      await this.oauthService.oauthCallback(code);
    session.user = { id, name, gitlabUserId, githubUserId };
    response.redirect('/api/oauth/redirect');
  }
}
