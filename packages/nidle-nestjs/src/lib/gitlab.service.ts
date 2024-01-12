import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService, ConfigType } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { oauthConfig } from 'src/configuration';

export interface GitlabOauth {
  access_token?: string;
  token_type?: string;
  /** 过期时间，单位：秒 */
  expires_in?: number;
  refresh_token?: string;
  /** 创建时间，单位：秒 */
  created_at?: number;
}

const ACCESS_LEVEL_MAP = {
  10: 'Guest',
  20: 'Reporter',
  30: 'Developer',
  40: 'Maintainer',
  50: 'Owner',
};

@Injectable()
export class GitlabService {
  _gitlabConfig: ConfigType<typeof oauthConfig>['gitlab'];
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {
    this._gitlabConfig = this.configService.get('oauthConfig').gitlab;
  }

  /**
   * 根据url获取仓库名，支持 ssh / http
   * #### etc:
   *  - git@gitbj.haihangyun.com:ava/xxx[.git]
   *  - http://gitbj.haihangyun.com/ava/xxx[.git]
   * ##### ps: 尾部的 '.git' 已被截除 @see /src/system/project/project.controller.ts:create()
   * @param repositoryUrl
   * @returns etc: 'ava/xxx'
   */
  getProjectInfoByUrl(repositoryUrl: string) {
    let name = '';
    let url = '';
    if (repositoryUrl.startsWith('git@')) {
      name = repositoryUrl.split(':')[1];
      url = `${this._gitlabConfig.baseUrl}/${name}`;
    } else {
      name = repositoryUrl.replace(`${this._gitlabConfig.baseUrl}/`, '');
      url = repositoryUrl;
    }
    return { name, url };
  }

  getCommitUrl(repositoryUrl: string, commitId: string) {
    return `${this.getProjectInfoByUrl(repositoryUrl).url}/commit/${commitId}`;
  }
  getTreeUrl(repositoryUrl: string, commitId: string) {
    return `${this.getProjectInfoByUrl(repositoryUrl).url}/tree/${commitId}`;
  }

  async request<T = any>({
    url,
    ...restParam
  }: AxiosRequestConfig<Record<string, any>>) {
    const _url = this._gitlabConfig.baseUrl + url;
    const { data, status } = await this.httpService.axiosRef
      .request<T>({
        url: _url,
        ...restParam,
      })
      .catch((e) => {
        const errMsg = `gitlab request err:${e?.message}`;
        this.logger.error(errMsg, {
          error: JSON.stringify(e, Object.getOwnPropertyNames(e), 2),
          info: { url: _url, param: restParam },
        });
        throw new Error(errMsg);
      });

    if (status !== 200) {
      const message = `gitlab request not ok, data:${JSON.stringify(data)}`;
      this.logger.error(message, {
        statusCode: status,
        info: { url: _url, param: restParam },
      });
      throw new Error(message);
    }
    return data;
  }

  /**
   * 获取 access_token
   * @param code
   * @returns
   * Example:
   * {
   *    "access_token": "64位字符串",
   *    "token_type": "bearer",
   *    "expires_in": 7200,
   *    "refresh_token": "64位字符串",
   *    "created_at": 1628711391
   *  }
   */
  getOauthToken(code: string): Promise<GitlabOauth> {
    if (!code) {
      throw new Error('gitlab authorization_code 不能为空！');
    }
    return this.request({
      url: '/oauth/token',
      method: 'post',
      data: {
        code,
        grant_type: 'authorization_code',
        redirect_uri: this._gitlabConfig.redirectUri,
        client_id: this._gitlabConfig.clientId,
        client_secret: this._gitlabConfig.clientSecret,
      },
    });
  }

  refreshOauthToken(refresh_token?: string): Promise<GitlabOauth> {
    if (!refresh_token) {
      throw new Error('gitlab refresh_token 不能为空！');
    }
    return this.request({
      url: '/oauth/token',
      method: 'post',
      data: {
        refresh_token,
        grant_type: 'refresh_token',
        redirect_uri: this._gitlabConfig.redirectUri,
        client_id: this._gitlabConfig.clientId,
        client_secret: this._gitlabConfig.clientSecret,
      },
    });
  }

  async apiv4get<T = any>(
    url: string,
    opt?: Omit<AxiosRequestConfig<Record<string, any>>, 'url' | 'method'> & {
      accessToken?: string;
    },
  ) {
    let headers = { ...(opt?.headers || {}) };
    if (opt?.accessToken) {
      headers = {
        ...headers,
        Authorization: `Bearer ${opt.accessToken}`,
      };
      delete opt.accessToken;
    }
    // accessToken 不存在时，用 privateToken
    if (!headers.Authorization) {
      headers = {
        ...headers,
        'PRIVATE-TOKEN': this._gitlabConfig.privateToken,
      };
    }
    return this.request<T>({
      url: `/api/v4${url}`,
      method: 'get',
      headers,
      ...opt,
    });
  }

  // 获取应用成员
  async getMembers(repositoryUrl: string, accessToken?: string) {
    const projectName = this.getProjectInfoByUrl(repositoryUrl).name;
    const pathArr = projectName.split('/');
    const group = pathArr.length === 2 ? pathArr[0] : null;

    let groupMembers;
    if (group) {
      groupMembers = await this.apiv4get(`/groups/${group}/members`, {
        accessToken,
      });
    }
    const projectMembers = await this.apiv4get(
      `/projects/${encodeURIComponent(projectName)}/members`,
      {
        accessToken,
      },
    );

    const members = [...(projectMembers || []), ...(groupMembers || [])].map(
      (member) => ({
        role: ACCESS_LEVEL_MAP[member.access_level],
        ...member,
      }),
    );
    return members;
  }

  async checkMemberAuth(
    repositoryUrl: string,
    repositoryUserId: number,
    accessToken?: string,
  ) {
    const memberList = await this.getMembers(repositoryUrl, accessToken);
    return Boolean(
      memberList.find(
        ({ id, access_level }) => id === repositoryUserId && access_level > 20,
      ),
    );
  }

  getFile(id: number, branch: string, filePath: string, accessToken?: string) {
    return this.apiv4get(
      `/projects/${id}/repository/files/${encodeURIComponent(
        filePath,
      )}/raw?ref=${branch}`,
      {
        accessToken,
      },
    );
  }

  // 获取某个项目的信息
  getProjectDetail(repositoryUrl: string, accessToken?: string) {
    const projectName = this.getProjectInfoByUrl(repositoryUrl).name;
    return this.apiv4get(`/projects/${encodeURIComponent(projectName)}`, {
      accessToken,
    });
  }

  // 获取项目分支信息
  getBranches(id: number, params: Record<string, any>, accessToken?: string) {
    return this.apiv4get(
      /**
       * https://docs.gitlab.com/ee/api/branches.html
       *
       * query 字段：
       * per_page: 上限为 100，超出 100 依然只返回 100 条
       * search: 模糊搜索
       */
      `/projects/${id}/repository/branches`,
      { params, accessToken },
    );
  }

  getBranch(id: number, branch: string, accessToken?: string) {
    return this.apiv4get(
      `/projects/${id}/repository/branches/${encodeURIComponent(branch)}`,
      { accessToken },
    );
  }

  getUserInfo(accessToken?: string) {
    if (!accessToken) {
      throw new Error('gitlab accessToken 不能为空！');
    }
    return this.apiv4get('/user', { accessToken });
  }
}
