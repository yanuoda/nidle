import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService, ConfigType } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { oauthConfig } from 'src/configuration';

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

  async request<T = any>({
    url,
    headers = {},
    ...restParam
  }: AxiosRequestConfig<Record<string, any>>) {
    const _url = this._gitlabConfig.baseUrl + url;
    // console.log(`GitlabService-request:\n${_url}`);
    // console.log(`GitlabService-param:\n${JSON.stringify(restParam)}`);
    const { data, status } = await this.httpService.axiosRef.request<T>({
      url: _url,
      headers: { ...headers, 'PRIVATE-TOKEN': this._gitlabConfig.privateToken },
      ...restParam,
    });
    // console.log('GitlabService-response:');
    // console.log(JSON.stringify(data));

    if (status !== 200) {
      const message = `gitlab request not ok, data:${JSON.stringify(data)}`;
      this.logger.error(message, {
        statusCode: status,
        info: { url: _url, param: restParam, headers },
      });
      throw new Error(message);
    }
    return data;
  }

  apiv4get<T = any>(
    url: string,
    opt?: Omit<AxiosRequestConfig<Record<string, any>>, 'url' | 'method'>,
  ) {
    return this.request<T>({ url: `/api/v4${url}`, method: 'get', ...opt });
  }

  // 获取应用成员
  async getMembers(repositoryUrl: string) {
    const repositoryPath = repositoryUrl.replace(
      `${this._gitlabConfig.baseUrl}/`,
      '',
    );
    const pathArr = repositoryPath.split('/');
    const group = pathArr.length === 2 ? pathArr[0] : null;
    const id = encodeURIComponent(repositoryPath);

    let groupMembers;
    if (group) {
      groupMembers = await this.apiv4get(`/groups/${group}/members`);
    }
    const projectMembers = await this.apiv4get(`/projects/${id}/members`);

    const members = [...(projectMembers || []), ...(groupMembers || [])].map(
      (member) => ({
        role: ACCESS_LEVEL_MAP[member.access_level],
        ...member,
      }),
    );
    return members;
  }

  async checkMemberAuth(repositoryUrl: string, repositoryUserId: number) {
    const memberList = await this.getMembers(repositoryUrl);
    return Boolean(
      memberList.find(
        ({ id, access_level }) => id === repositoryUserId && access_level > 20,
      ),
    );
  }

  getFile(id: number, branch: string, filePath: string) {
    return this.apiv4get(
      `/projects/${id}/repository/files/${encodeURIComponent(
        filePath,
      )}/raw?ref=${branch}`,
    );
  }

  // 获取某个项目的信息
  async getProjectDetail(repositoryUrl: string) {
    const repositoryPath = repositoryUrl.replace(
      `${this._gitlabConfig.baseUrl}/`,
      '',
    );
    const id = encodeURIComponent(repositoryPath);
    return await this.apiv4get(`/projects/${id}`);
  }

  // 获取项目分支信息
  async getBranches(id: number, params?: Record<string, any>) {
    return await this.apiv4get(
      /**
       * https://docs.gitlab.com/ee/api/branches.html
       *
       * query 字段：
       * per_page: 上限为 100，超出 100 依然只返回 100 条
       * search: 模糊搜索
       */
      `/projects/${id}/repository/branches`,
      { params },
    );
  }

  async getBranch(id: number, branch: string) {
    return await this.apiv4get(
      `/projects/${id}/repository/branches/${encodeURIComponent(branch)}`,
    );
  }
}
