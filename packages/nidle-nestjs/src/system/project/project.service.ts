import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { buildLikeWhere } from 'src/utils';
import { Environment } from 'src/common/base.dto';
import {
  CreateProjectDto,
  CreateOrUpdateProjectDto,
  QueryProjectListDto,
  ProjectData,
  ServerList,
} from './project.dto';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
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

  async findOne(id: number): Promise<ProjectData> {
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
    return {
      ...restColumn,
      serverList,
    };
  }

  async update({ id, ...restParam }: CreateOrUpdateProjectDto) {
    const existProject = await this.projectRepository.findOne({
      where: { id },
    });
    if (!existProject) {
      throw new Error(`项目id:${id}不存在`);
    }
    Object.assign(existProject, restParam);
    return await this.projectRepository.save(existProject);
  }

  async remove(id: number) {
    return await this.projectRepository.delete({ id });
  }
}
