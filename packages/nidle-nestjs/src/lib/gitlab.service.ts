import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

const { OAUTH_GITLAB_BASEURL, GITLAB_PRIVATE_TOKEN } = process.env;
const ACCESS_LEVEL_MAP = {
  10: 'Guest',
  20: 'Reporter',
  30: 'Developer',
  40: 'Maintainer',
  50: 'Owner',
};

@Injectable()
export class GitlabService {
  constructor(private readonly httpService: HttpService) {}

  async request({ url, method }: { url: string; method: 'get' | 'post' }) {
    const _url = `${OAUTH_GITLAB_BASEURL}/api/v4${url}`;
    const { data, status } = await this.httpService.axiosRef.request({
      url: _url,
      method,
      headers: { 'PRIVATE-TOKEN': GITLAB_PRIVATE_TOKEN },
    });
    console.log(`GitlabService-request:${_url}`);
    console.log('response:');
    console.log(data);

    if (status !== 200) {
      throw new Error(data);
    }
    return data;
  }

  get(url: string) {
    return this.request({ url, method: 'get' });
  }

  // 获取应用成员
  async getMembers(repositoryUrl: string) {
    const repositoryPath = repositoryUrl.replace(
      `${OAUTH_GITLAB_BASEURL}/`,
      '',
    );
    const pathArr = repositoryPath.split('/');
    const group = pathArr.length === 2 ? pathArr[0] : null;
    const id = encodeURIComponent(repositoryPath);

    let groupMembers;
    if (group) {
      groupMembers = await this.get(`/groups/${group}/members`);
    }
    const projectMembers = await this.get(`/projects/${id}/members`);

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
    return this.get(
      `/projects/${id}/repository/files/${encodeURIComponent(
        filePath,
      )}/raw?ref=${branch}`,
    );
  }

  // 获取某个项目的信息
  async getProjectDetail(repositoryUrl: string) {
    const repositoryPath = repositoryUrl.replace(
      `${OAUTH_GITLAB_BASEURL}/`,
      '',
    );
    const id = encodeURIComponent(repositoryPath);
    return await this.get(`/projects/${id}`);
  }

  // 获取项目分支信息
  async getBranches(id: number) {
    return await this.get(
      // 现在将分页限制放开限制为100条；如果以后还超出此限制，需要做分页请求；参考https://docs.gitlab.com/ee/api/#pagination
      `/projects/${id}/repository/branches?per_page=100`,
    );
  }

  async getBranch(id: number, branch: string) {
    return await this.get(
      `/projects/${id}/repository/branches/${encodeURIComponent(branch)}`,
    );
  }
}
