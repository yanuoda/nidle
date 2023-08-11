import { Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';

import { GitlabService } from 'src/lib/gitlab.service';
import { oauthConfig } from 'src/configuration';
import { UserService } from '../user/user.service';

@Injectable()
export class OauthService {
  _oauthConfig: ConfigType<typeof oauthConfig>;
  constructor(
    private readonly configService: ConfigService,
    private readonly gitlabService: GitlabService,
    private readonly userService: UserService,
  ) {
    this._oauthConfig = this.configService.get('oauthConfig');
  }

  async oauthCallback(code: string) {
    // 获取 access token
    const tokenRes = await this.gitlabService.request({
      url: '/oauth/token',
      method: 'post',
      data: {
        code,
        grant_type: 'authorization_code',
        redirect_uri: this._oauthConfig.gitlab.redirectUri,
        client_id: this._oauthConfig.gitlab.clientId,
        client_secret: this._oauthConfig.gitlab.clientSecret,
      },
    });
    // 获取 gitlab 用户信息
    const userInfo = await this.gitlabService.apiv4get('/user', {
      headers: { Authorization: `Bearer ${tokenRes?.access_token}` },
    });
    const { id: gitlabUserId, username: name } = userInfo || {};
    /** @check 关联 github 账号 */
    let currentUser = await this.userService.find({ gitlabUserId });
    if (!currentUser) {
      currentUser = await this.userService.register({ name, gitlabUserId });
    }
    return {
      id: currentUser.id,
      name,
      gitlabUserId,
      githubUserId: currentUser.githubUserId,
    };
  }
}
