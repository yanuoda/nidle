import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService, ConfigType } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';

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
  ) {
    this._gitlabConfig = this.configService.get('oauthConfig').gitlab;
  }

  async request({
    url,
    headers = {},
    ...restParam
  }: AxiosRequestConfig<Record<string, any>>) {
    const _url = this._gitlabConfig.baseUrl + url;
    const { data, status } = await this.httpService.axiosRef.request({
      url: _url,
      headers: { ...headers, 'PRIVATE-TOKEN': this._gitlabConfig.privateToken },
      ...restParam,
    });
    // console.log(`GitlabService-request:\n${_url}`);
    // console.log('response:');
    // console.log(JSON.stringify(data));

    if (status !== 200) {
      throw new Error(data);
    }
    return data;
  }

  apiv4get(
    url: string,
    opt?: Omit<AxiosRequestConfig<Record<string, any>>, 'url' | 'method'>,
  ) {
    return this.request({ url: `/api/v4${url}`, method: 'get', ...opt });
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
  async getBranches(id: number) {
    return await this.apiv4get(
      // 现在将分页限制放开限制为100条；如果以后还超出此限制，需要做分页请求；参考https://docs.gitlab.com/ee/api/#pagination
      `/projects/${id}/repository/branches?per_page=100`,
    );
  }

  async getBranch(id: number, branch: string) {
    return await this.apiv4get(
      `/projects/${id}/repository/branches/${encodeURIComponent(branch)}`,
    );
  }
}
