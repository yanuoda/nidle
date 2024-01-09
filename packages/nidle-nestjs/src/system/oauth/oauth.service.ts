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
    const gitlabOauth = await this.gitlabService.getOauthToken(code);
    // 获取 gitlab 用户信息
    const userInfo = await this.gitlabService.getUserInfo(
      gitlabOauth?.access_token,
    );

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
      gitlabOauth,
      githubUserId: currentUser.githubUserId,
    };
  }
}
