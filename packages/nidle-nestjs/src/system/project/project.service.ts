import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository, In, Not } from 'typeorm';
import * as dayjs from 'dayjs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { groupBy } from 'lodash';

import { buildEqualWhere, buildLikeWhere, checkValue } from 'src/utils';
import nidleNext from 'src/utils/nidleNext';
import { Environment, SessionUser } from 'src/common/base.dto';
import { GitlabService } from 'src/lib/gitlab.service';
import { ChangelogService } from '../changelog/changelog.service';
import { UserService } from '../user/user.service';
import { ServerService } from '../server/server.service';
import {
  CreateProjectDto,
  CreateOrUpdateProjectDto,
  QueryProjectListDto,
  ProjectData,
  ServerList,
  CreateProjectServerDto,
  UpdateProjectServerDto,
  AssembleChangelog,
  PublishEnvListMap,
  QueryPublishListDto,
  RelationIdProjectServer,
} from './project.dto';
import { Project } from './entities/project.entity';
import { ProjectServer } from './entities/project_server.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectServer)
    private readonly projectServerRepository: Repository<ProjectServer>,
    private readonly gitlabService: GitlabService,
    @Inject(forwardRef(() => ChangelogService))
    private readonly changelogService: ChangelogService,
    private readonly userService: UserService,
    private readonly serverService: ServerService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async create(createProjectDto: CreateProjectDto, user?: SessionUser) {
    const newProject = new Project();
    Object.assign(newProject, createProjectDto);
    const { repositoryType, repositoryUrl } = createProjectDto;
    // 获取项目 owner / gitId
    let owner = '';
    let gitId: number;
    if (repositoryType === 'gitlab') {
      const projectMembers = await this.gitlabService.getMembers(
        repositoryUrl,
        user?.gitlabOauth?.access_token,
      );
      owner = projectMembers.find(
        (member) => member.access_level === 50,
      )?.username;
      const { id } = await this.gitlabService.getProjectDetail(
        repositoryUrl,
        user?.gitlabOauth?.access_token,
      );
      gitId = id;
    } else {
      /** @check github getMembers */
      // owner = projectMembers.filter(member => member.role_name === 'admin').map(item => item.login)[0]
      // const { id } = await this.githubService.getProjectDetail(repositoryUrl);
      // gitId = id; // github id 也赋值在 gitlabId 字段上
    }
    if (owner) newProject.owner = owner;
    if (gitId) newProject.gitlabId = gitId;

    return await this.projectRepository.save(newProject);
  }

  async findAllByPage({
    name,
    owner,
    repositoryType,
    current,
    pageSize,
    order = {},
  }: QueryProjectListDto) {
    const [list, total] = await this.projectRepository.findAndCount({
      select: [
        'id',
        'name',
        'description',
        'owner',
        'repositoryType',
        'repositoryUrl',
      ],
      skip: (current - 1) * pageSize,
      take: pageSize,
      // order: { createdTime: 'DESC' },
      order,
      where: buildLikeWhere<Project>({
        name,
        owner,
        repositoryType,
      }),
    });
    return { list, total };
  }

  async findAllByWhere(_where: FindOptionsWhere<Project>) {
    return await this.projectRepository.findBy(_where);
  }

  async findOne(where: FindOptionsWhere<Project>) {
    const _where = buildEqualWhere(where);
    if (!Object.keys(_where).length) {
      throw new Error('findOne 的条件(where)不能为空');
    }
    const existProject = await this.projectRepository.findOneBy(_where);
    if (!existProject) {
      throw new Error(`项目不存在 - where:${JSON.stringify(_where)}`);
    }
    return existProject;
  }

  async findProjectAndRelations(
    id: number,
    user?: SessionUser,
  ): Promise<ProjectData> {
    checkValue(id, '项目id');
    const existProject = await this.projectRepository.findOne({
      where: { id },
      relations: { projectServers: { server: true } },
    });

    if (!existProject) {
      throw new Error(`项目id:${id}不存在`);
    }
    const { projectServers, ...restColumn } = existProject;
    const serverList = new ServerList();
    (projectServers as Array<Omit<ProjectServer, 'project'>>).forEach(
      ({ server, ...restData }) => {
        const { id, name, ip, status } = server;
        serverList[restData.environment as Environment].push({
          ...restData,
          server: id,
          Server: { id, name, ip, status },
        });
      },
    );
    let resList: Record<string, any>[];
    if (existProject.repositoryType === 'gitlab') {
      resList = await this.gitlabService
        .getMembers(existProject.repositoryUrl, user?.gitlabOauth?.access_token)
        .catch((e) => {
          const errMsg = `findProjectAndRelations gitlabService.getMembers err:${e?.message}`;
          this.logger.error(errMsg, {
            error: JSON.stringify(e, Object.getOwnPropertyNames(e), 2),
            info: { repositoryUrl: existProject.repositoryUrl },
          });
          return [];
        });
    } else {
      /** @check github getMembers */
    }
    const memberList = resList.map((item) => {
      return {
        ...item,
        web_url: item.web_url || item.html_url,
        name: item.name || item.login,
        username: item.username || item.login,
        role: item.role || item.role_name,
      };
    });
    return {
      ...restColumn,
      serverList,
      memberList,
    };
  }

  async update({ id, ...restParam }: CreateOrUpdateProjectDto) {
    const existProject = await this.findOne({ id });
    Object.assign(existProject, restParam);
    return await this.projectRepository.save(existProject);
  }

  async remove(id: number) {
    const project = await this.findOne({ id });
    this.logger.info(`delete project:${id}`, {
      original: project,
    });
    return await this.projectRepository.delete({ id });
  }

  async getBranches(id: number, search: string, accessToken?: string) {
    const { gitlabId, repositoryType } = await this.findOne({ id });
    const query: Record<string, any> = { per_page: 50 };
    if (search) query.search = search;
    let branches: Record<string, any>;
    if (repositoryType === 'gitlab') {
      branches = await this.gitlabService.getBranches(
        gitlabId,
        query,
        accessToken,
      );
    } else {
      /** @check github getBranches(repositoryUrl) */
    }
    return branches;
  }

  async updateContacts(id: number, postEmails: string) {
    return await this.projectRepository.update({ id }, { postEmails });
  }

  /** projectServer ↓ */

  async createProjectServer({
    project,
    server,
    ...param
  }: CreateProjectServerDto) {
    const newProjectServer = new ProjectServer();
    Object.assign(newProjectServer, param);
    newProjectServer.project = await this.findOne({ id: project });
    const serverData = await this.serverService.findOne(server);
    newProjectServer.server = serverData;

    const newObj: Omit<ProjectServer, 'project' | 'server'> =
      await this.projectServerRepository.save(newProjectServer);

    return { ...newObj, Server: serverData, server, project };
  }

  async findProjectServerBy(where: FindOptionsWhere<ProjectServer>) {
    const _where = buildEqualWhere(where);
    if (!Object.keys(_where).length) {
      throw new Error('findProjectServerBy: findOne 的条件(where)不能为空');
    }
    const existProjectServer: Omit<ProjectServer, 'project' | 'server'> =
      await this.projectServerRepository.findOne({
        where: _where,
        loadRelationIds: true,
        // relations: { project: true, server: true },
      });
    if (!existProjectServer) {
      throw new Error(`项目服务器配置不存在 - where:${JSON.stringify(_where)}`);
    }
    return existProjectServer as RelationIdProjectServer;
  }

  async updateProjectServer({
    id,
    project,
    server,
    ...restParam
  }: UpdateProjectServerDto) {
    const existProjectServer = await this.findProjectServerBy({ id });
    Object.assign(existProjectServer, restParam);
    const projectId = project || existProjectServer.project;
    const _project = await this.findOne({ id: projectId });
    const serverId = server || existProjectServer.server;
    const _server = await this.serverService.findOne(serverId);

    const newObj: Omit<ProjectServer, 'project' | 'server'> =
      await this.projectServerRepository.save({
        ...existProjectServer,
        project: _project,
        server: _server,
      });

    return { ...newObj, Server: _server, server: serverId, project: projectId };
  }

  async removeProjectServer(id: number) {
    const projectServer = await this.findProjectServerBy({ id });
    this.logger.info(`delete projectServer:${id}`, {
      original: projectServer,
    });
    return await this.projectServerRepository.delete({ id });
  }

  async setProjectServerOccupation(id: number, changelog: number) {
    return await this.projectServerRepository.update({ id }, { changelog });
  }
  async resetProjectServerOccupation(changelog: number) {
    return await this.projectServerRepository.update(
      { changelog },
      { changelog: null },
    );
  }

  async fetchProjectServerBy(_where: FindOptionsWhere<ProjectServer>) {
    const list: Array<Omit<ProjectServer, 'project'>> =
      await this.projectServerRepository.find({
        where: buildEqualWhere(_where),
        relations: { server: true },
      });
    const projectServers = list.map(({ server, ...restData }) => {
      const { id, ...serverRest } = server;
      return {
        Server: { id, ...serverRest },
        server: id,
        ...restData,
      };
    });
    return projectServers;
  }

  /**
   * 查询全部 changelog 后才分组
   * - 已优化为分组分页查询 @see findPublishByPage
   * @deprecated
   */
  async getPublishList(projectId: number) {
    const changelogList = await this.changelogService.findAllByOpts({
      where: { project: projectId },
      order: { createdTime: 'DESC' },
    });
    const members = await this.userService.findAllByWhere({
      id: In(
        Array.from(new Set(changelogList.map(({ developer }) => developer))),
      ),
    });
    const { repositoryUrl } = await this.findOne({ id: projectId });
    const list = changelogList.map(({ developer, ...changelog }) => {
      // 开发者信息
      const currentDeveloper = members.find(({ id }) => id === developer);
      return {
        ...changelog,
        developer: currentDeveloper?.name || String(developer),
        commitUrl: `${repositoryUrl}/commit/${changelog.commitId}`,
      };
    });

    // 按 period 聚合发布记录
    const periodMap: Record<string, AssembleChangelog[]> = {};
    list.forEach((changelog) => {
      const { period } = changelog;
      if (!periodMap[period]) {
        periodMap[period] = [];
      }
      periodMap[period].push(changelog);
    });
    // 同一个 period 下的发布记录倒序
    // Object.keys(periodMap).forEach((period) => {
    //   periodMap[period].sort((a, b) => {
    //     return dayjs(b.createdTime).diff(dayjs(a.createdTime));
    //   });
    // });
    // sql order: { createdTime: 'DESC' } 已实现倒序

    /**
     * 转换成前端 table 需要的格式
     * - 同一个 period [{ ...changelog, children }]
     */
    const publishEnvMap = new PublishEnvListMap();
    Object.values(periodMap).forEach((_list) => {
      const [parent, ...children] = _list;
      const env = parent.environment as Environment;
      const _obj: AssembleChangelog = {
        ...parent,
        nextPublish: nidleNext(parent),
      };
      if (children.length > 0) {
        children.forEach((child) => {
          // 标识 child
          child.isChild = true;
          delete child.branch;
          delete child.description;
        });
        _obj.children = children;
      }
      publishEnvMap[env].push(_obj);
    });
    // 按 更新时间（活跃） 降序
    Object.keys(publishEnvMap).forEach((env: Environment) => {
      publishEnvMap[env].sort((a, b) => {
        return dayjs(b.updatedTime).diff(dayjs(a.updatedTime));
      });
    });
    return publishEnvMap;
  }

  async findPublishByPage({
    projectId,
    environment,
    current,
    pageSize,
  }: QueryPublishListDto) {
    const [changelogList, total] =
      await this.changelogService.findPublishGroupByPage(
        projectId,
        environment,
        current,
        pageSize,
      );

    const members = await this.userService.findAllByWhere({
      id: In(
        Array.from(new Set(changelogList.map(({ developer }) => developer))),
      ),
    });
    const { repositoryUrl } = await this.findOne({ id: projectId });
    const list = changelogList.map(
      ({ developer, periodCount, ...changelog }) => {
        // 开发者信息
        const currentDeveloper = members.find(({ id }) => id === developer);
        return {
          ...changelog,
          developer: currentDeveloper?.name || String(developer || '-'),
          commitUrl: `${repositoryUrl}/commit/${changelog.commitId}`,
          nextPublish: nidleNext(changelog),
          children: periodCount > 1 ? [] : undefined,
        } as AssembleChangelog;
      },
    );
    return { list, total };
  }

  async findPublishChildren({
    projectId,
    environment,
    excludeId,
    period,
    showInfo,
    current,
    pageSize,
  }: QueryPublishListDto) {
    const [changelogList, total] = await this.changelogService.findAllByPage({
      skip: (current - 1) * pageSize,
      take: pageSize,
      order: { createdTime: 'DESC' },
      where: { project: projectId, environment, id: Not(excludeId), period },
    });
    const members = await this.userService.findAllByWhere({
      id: In(
        Array.from(new Set(changelogList.map(({ developer }) => developer))),
      ),
    });
    const { repositoryUrl } = await this.findOne({ id: projectId });
    const list = changelogList.map(({ developer, ...changelog }) => {
      // 开发者信息
      const currentDeveloper = members.find(({ id }) => id === developer);
      return {
        ...changelog,
        isChild: true,
        branch: showInfo ? changelog.branch : undefined,
        description: showInfo ? changelog.description : undefined,
        developer: currentDeveloper?.name || String(developer || '-'),
        commitUrl: `${repositoryUrl}/commit/${changelog.commitId}`,
      } as AssembleChangelog;
    });
    return { list, total };
  }

  async getWebhooks(productId: number) {
    const changelogs = await this.changelogService.getWebhookChangelogs([
      productId,
    ]);
    return groupBy(changelogs, 'branch');
  }

  async invokeWebhooks(productId: number, branch: string, user: SessionUser) {
    const projectRow = await this.changelogService.checkAndGetProjectInfo(
      productId,
      user,
    );
    return await this.changelogService.handleAutoDeploy([projectRow], branch);
  }
}
