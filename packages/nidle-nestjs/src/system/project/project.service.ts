import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository, In } from 'typeorm';
import dayjs from 'dayjs';

import { buildLikeWhere } from 'src/utils';
import nidleNext from 'src/utils/nidleNest';
import { Environment } from 'src/common/base.dto';
import { GitlabService } from 'src/lib/gitlab.service';
import { ChangelogService } from '../changelog/changelog.service';
import { UserService } from '../user/user.service';
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
    private readonly changelogService: ChangelogService,
    private readonly userService: UserService,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const newProject = new Project();
    Object.assign(newProject, createProjectDto);
    return await this.projectRepository.save(newProject);
  }

  async findAll({
    name,
    owner,
    repositoryType,
    current,
    pageSize,
  }: QueryProjectListDto) {
    const [list, total] = await this.projectRepository.findAndCount({
      select: ['id', 'name', 'owner', 'repositoryType'],
      skip: (current - 1) * pageSize,
      take: pageSize,
      order: { createdTime: 'DESC' },
      where: buildLikeWhere<Project>({
        name,
        owner,
        repositoryType,
      }),
    });
    return { list, total };
  }

  async findOne(_where: FindOptionsWhere<Project>) {
    const existProject = await this.projectRepository.findOneBy(_where);
    if (!existProject) {
      throw new Error(`项目不存在 - where:${JSON.stringify(_where)}`);
    }
    return existProject;
  }

  async findProjectAndRelations(id: number): Promise<ProjectData> {
    const existProject = await this.projectRepository.findOne({
      where: { id },
      relations: { projectServers: { server: true } },
    });
    if (!existProject) {
      throw new Error(`项目id:${id}不存在`);
    }
    const { projectServers, ...restColumn } = existProject;
    const serverList = new ServerList();
    projectServers.forEach(({ server, ...restData }) => {
      const { id, name, ip } = server;
      serverList[restData.environment as Environment].push({
        ...restData,
        Server: { id, name, ip },
      });
    });
    let resList: Record<string, any>[];
    if (existProject.repositoryType === 'gitlab') {
      resList = await this.gitlabService.getMembers(existProject.repositoryUrl);
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
    return await this.projectRepository.delete({ id });
  }

  async getBranches(id: number) {
    const { gitlabId, repositoryType } = await this.findOne({ id });
    let branches: Record<string, any>;
    if (repositoryType === 'gitlab') {
      branches = await this.gitlabService.getBranches(gitlabId);
    } else {
      /** @check github getBranches(repositoryUrl) */
    }
    return branches;
  }

  async updateContacts(id: number, postEmails: string) {
    return await this.projectRepository.update({ id }, { postEmails });
  }

  /** projectServer ↓ */

  async createProjectServer(param: CreateProjectServerDto) {
    const newProjectServer = new ProjectServer();
    Object.assign(newProjectServer, param);
    return await this.projectServerRepository.save(newProjectServer);
  }

  async findProjectServerBy(_where: FindOptionsWhere<ProjectServer>) {
    const existProjectServer = await this.projectServerRepository.findOneBy(
      _where,
    );
    if (!existProjectServer) {
      throw new Error(`项目服务器配置不存在 - where:${JSON.stringify(_where)}`);
    }
    return existProjectServer;
  }

  async updateProjectServer({ id, ...restParam }: UpdateProjectServerDto) {
    const existProjectServer = await this.findProjectServerBy({
      id,
    });
    Object.assign(existProjectServer, restParam);
    return await this.projectServerRepository.save(existProjectServer);
  }

  async removeProjectServer(id: number) {
    return await this.projectServerRepository.delete({ id });
  }

  async resetProjectServerOccupation(changelog: number) {
    return await this.projectServerRepository.update(
      { changelog },
      { changelog: null },
    );
  }

  async fetchProjectServer(projectId: number, environment = '') {
    const _where: FindOptionsWhere<ProjectServer> = {
      project: { id: projectId },
    };
    if (environment) {
      _where.environment = environment;
    }
    const list = await this.projectServerRepository.find({
      where: _where,
      relations: { server: true },
    });
    const projectServers = list.map(({ server, ...restData }) => {
      const { id, name, ip, description, status } = server;
      return {
        Server: { id, name, ip, description, status },
        ...restData,
      };
    });
    if (environment) return projectServers;

    const serverList = new ServerList();
    projectServers.forEach((pss) => {
      serverList[pss.environment as Environment].push(pss);
    });
    return serverList;
  }

  /**
   * @todo 查询全部 changelog 后才分组
   *
   * 1.优化成条件Environment查询
   *
   * 2.优化成分页 `this.changelogService.findAllByPage`(sql 难点)
   *
   * 重构为分页时需考虑 period 聚合问题，可以先按 period 字段 groupBy 取最新一条，
   * 再根据 period 查询(left join)过往记录组装 children
   *
   * 需要使用 typeorm `QueryBuilder` 构建 sql
   */
  async getPublishList(projectId: number) {
    const changelogList = await this.changelogService.findAllBy({
      where: { project: projectId },
      order: { createdTime: 'DESC' },
    });
    const members = await this.userService.findAllBy({
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
      children.forEach((child) => {
        // 标识 child
        child.isChild = true;
        delete child.branch;
        delete child.description;
      });
      publishEnvMap[env].push({
        ...parent,
        children,
        nextPublish: nidleNext(parent),
      });
    });
    // 按 更新时间（活跃） 降序
    Object.keys(publishEnvMap).forEach((env: Environment) => {
      publishEnvMap[env].sort((a, b) => {
        return dayjs(b.updatedTime).diff(dayjs(a.updatedTime));
      });
    });
    return publishEnvMap;
  }
}
