import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService as NestConfigService, ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as path from 'path';
import * as fs from 'fs';
import * as extend from 'extend';
import { cloneDeep } from 'lodash';
import * as Nidle from 'nidle';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import _const from 'src/const';
import { SessionUser } from 'src/common/base.dto';
import { GitlabService } from 'src/lib/gitlab.service';
import { nidleConfig } from 'src/configuration';
import { checkValue, readConfig, writeConfig } from 'src/utils';
import nidleNext from 'src/utils/nidleNest';
import { getDuration, transform } from 'src/utils/log';

import { ProjectService } from '../project/project.service';
import { Project } from '../project/entities/project.entity';
import { ServerService } from '../server/server.service';
import { ConfigService } from '../config/config.service';
import { MessageService } from '../message/message.service';
import { UserService } from '../user/user.service';
import {
  CodeReviewDto,
  CreateChangelogData,
  CreateChangelogDto,
  GetLogDto,
  MergeHookDto,
  StartChangelogDto,
} from './changelog.dto';
import {
  Changelog,
  CodeReviewStatus,
  Status,
  StatusNum,
} from './changelog.entity';

@Injectable()
export class ChangelogService {
  _nidleConfig: ConfigType<typeof nidleConfig>;
  constructor(
    private readonly gitlabService: GitlabService,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
    private readonly serverService: ServerService,
    @Inject(forwardRef(() => ConfigService))
    private readonly configService: ConfigService,
    private readonly nestConfigService: NestConfigService,
    @InjectRepository(Changelog)
    private readonly changelogRepository: Repository<Changelog>,
    @InjectQueue('changelog')
    private readonly changelogQueue: Queue,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
  ) {
    this._nidleConfig = this.nestConfigService.get('nidleConfig');
  }

  async findOneBy(id: number) {
    checkValue(id, '发布记录id');
    const changelog = await this.changelogRepository.findOneBy({
      id,
    });
    if (!changelog) {
      throw new Error(`发布记录id:${id}不存在`);
    }
    return changelog;
  }
  async updateOne(id: number, updateObj: Partial<Changelog>) {
    const changelog = await this.findOneBy(id);
    this.logger.info(`update changelog:${id}`, {
      original: changelog,
      updateObj,
    });
    Object.assign(changelog, updateObj);
    return await this.changelogRepository.save(changelog);
  }
  async deleteOne(id: number) {
    const changelog = await this.findOneBy(id);
    this.logger.info(`delete changelog:${id}`, {
      original: changelog,
    });
    return await this.changelogRepository.delete({ id });
  }

  async findAllByOpts(opts: FindManyOptions<Changelog>) {
    return await this.changelogRepository.find(opts);
  }

  async findAllByPage(opts: FindManyOptions<Changelog>) {
    return await this.changelogRepository.findAndCount(opts);
  }

  async checkAndGetProjectInfo(projectId: number, user: SessionUser) {
    const {
      repositoryType,
      repositoryUrl,
      name: projectName,
      gitlabId,
    } = await this.projectService.findOne({ id: projectId });
    const repositoryUserId: number = user[`${repositoryType}UserId`];
    if (!repositoryUserId) {
      throw new Error(`未关联 ${repositoryType} 账号`);
    }

    let canUserOperate = false;
    if (repositoryType === 'gitlab') {
      canUserOperate = await this.gitlabService.checkMemberAuth(
        repositoryUrl,
        repositoryUserId,
      );
    } else {
      /** @todo github */
      // const memberList = await ctx.service[repositoryType].getMembers(repositoryUrl)
      // const idx = memberList.findIndex(item => item.id === repositoryUserId && item.role_name !== 'none' && item.role_name !== 'read')
      // return idx > -1
    }
    if (!canUserOperate) {
      throw new Error('您没有该应用权限，不能进行此操作');
    }

    return {
      repositoryType,
      repositoryUrl,
      projectName,
      gitlabId,
    };
  }

  async checkChangelogNext(type: string, mode: string, id?: number) {
    const changelog = id ? await this.findOneBy(id) : null;
    // 检查是否能进入下一阶段
    if (type === 'normal') {
      const next = nidleNext(changelog, mode);
      if (next.next !== 'CREATE' || next.environment.value !== mode) {
        throw new Error(
          `请检查发布状态，暂时不能进入${mode}发布 - ${JSON.stringify(next)}`,
        );
      }
    }
    return changelog;
  }

  async create(
    {
      projectId,
      type,
      mode,
      branch,
      source = 'web',
      description,
      id,
    }: CreateChangelogDto,
    {
      repositoryType,
      repositoryUrl,
      projectName,
      gitlabId,
      changelog,
    }: CreateChangelogData,
    user?: SessionUser,
  ) {
    let commitId: string;
    if (!id || mode === _const.environments[0].value || type === 'webhook') {
      // 从测试环境发布时，取分支的最新commitId，后续发布都基于此commitId
      if (repositoryType === 'gitlab') {
        const branchInfo = await this.gitlabService.getBranch(gitlabId, branch);
        commitId = branchInfo.commit.id;
      } else {
        /** @todo github */
        // const branchInfo = await ctx.service.github.getBranch(repositoryUrl, branch);
        // commitId = branchInfo.commit.sha;
      }
    }

    const timestamp = Date.now();
    // 发布周期
    let period = String(timestamp);
    let options = {
      repository: {
        type: repositoryType,
        url: repositoryUrl,
        id: gitlabId,
        branch,
        commitId,
        userName: user?.name || type,
      },
      source: '',
      output: '',
    };

    if (id) {
      // 现有发布记录上创建，复用period
      period = changelog.period;
      commitId = commitId || changelog.commitId;
      options.repository.commitId = commitId;

      // 复用source、output
      const config = readConfig(changelog.configPath);

      options = {
        ...options,
        source: config.source,
        output: config.output,
      };

      // 解除环境占用
      await this.projectService.resetProjectServerOccupation(id);
    }

    const projectPublishFileKey = `${projectName}_${timestamp}`;
    // 整合任务配置
    const createConfig = await this.configService.getAppPublishConfig({
      projectObj: { gitlabId, repositoryType, repositoryUrl },
      mode,
      branch,
      type,
      isNew: !id,
      fileName: projectPublishFileKey,
    });
    const config = {
      ...options,
      ...createConfig,
    };
    let initConfig: Record<string, any> = {};
    if (createConfig) {
      const manager = new Nidle(extend(true, {}, config));
      initConfig = await manager.init();

      // 重新开始 || webhook自动构建，要清除源文件
      if (id && (type === 'webhook' || mode === _const.environments[0].value)) {
        manager.clear();
      }
    }

    // 将配置存起来
    const configPath = path.resolve(
      this._nidleConfig.config.path,
      `${mode}_${projectPublishFileKey}.json`,
    );
    writeConfig(configPath, {
      ...config,
      inputs: initConfig.inputs || [],
    });

    // 创建记录
    const newChangelogInstance = new Changelog();
    Object.assign(newChangelogInstance, {
      period,
      project: projectId,
      branch,
      type,
      developer: user?.id,
      source,
      // 如果没配置，即该环境没有构建任务，直接通过
      status: createConfig ? 'NEW' : 'SUCCESS',
      codeReviewStatus: 'NEW',
      environment: mode,
      configPath,
      logPath: createConfig ? config.log.all : null,
      active: 0,
      commitId,
      description,
    });
    const newChangelog = await this.changelogRepository.save(
      newChangelogInstance,
    );
    const next = nidleNext(newChangelog);

    if (source === 'web') {
      // 转换成schemaForm格式
      initConfig.inputs = this.configService.getInput(
        initConfig.inputs,
        initConfig.inputs,
        source,
      );
    }

    if (id) {
      // 将原记录设为已禁用
      await this.changelogRepository.update({ id }, { active: 1 });
    }

    return {
      config,
      changelog: {
        ...newChangelog,
        statusEnum: StatusNum[newChangelog.status],
        projectName,
      },
      ...initConfig,
      next,
    };
  }

  // 开始构建任务
  async start(
    {
      id: changelogId,
      configPath,
      options: inputAnswers,
      inputs = [],
      notTransform = false,
    }: StartChangelogDto,
    environment: string,
  ) {
    const answers = inputs.length
      ? this.configService.setInput(inputAnswers, inputs, notTransform)
      : [];
    const options = cloneDeep(answers);

    for (let i = 0; i < answers.length; i++) {
      const step = answers[i];

      // 特殊标识，用来标识type=servers的字段，以在使用时添加私密信息
      if (step._serversKey) {
        const serverList = [];

        for (let j = 0; j < step.options[step._serversKey].length; j++) {
          const item = step.options[step._serversKey][j];

          if (typeof item.serverId === 'undefined') {
            // 查找serverId
            const projectServer = await this.projectService.findProjectServerBy(
              {
                id: item.id,
              },
            );

            item.serverId = projectServer.server.id;
          }
          // 更新服务器被占用
          await this.projectService.setProjectServerOccupation(
            item.id,
            changelogId,
          );

          const server = await this.serverService.findOne(item.serverId);

          serverList.push({
            id: item.id,
            output: item.output,
            ip: server.ip,
            username: server.username,
            password: server.password,
          });
        }

        options[i].options[step._serversKey] = serverList;

        step.options[step._serversKey] = serverList.map((item) => {
          return {
            id: item.id,
            ip: item.ip,
            output: item.output,
          };
        });
        delete step._serversKey;
      }
    }

    const config = readConfig(configPath);
    writeConfig(configPath, {
      ...config,
      options: answers,
    });

    this.changelogQueue.add(
      'start',
      {
        config,
        options,
        changelogId,
        environment,
      },
      { attempts: 0 },
    );

    await this.changelogRepository.update(
      { id: changelogId },
      { status: Status.PENDING },
    );

    return true;
  }

  // 退出发布
  async quit(id: number, configPath: string) {
    // 解除环境占用
    await this.projectService.resetProjectServerOccupation(id);
    await this.changelogRepository.update(
      { id },
      {
        status: Status.CANCEL,
        active: 2,
      },
    );

    // 清除缓存
    const config = readConfig(configPath);
    const manager = new Nidle({
      ...config,
    });
    manager.clear();

    return true;
  }

  // 任务详情
  async detail(id: number) {
    const changelog = await this.findOneBy(id);
    const next = nidleNext(changelog);
    const project = await this.projectService.findOne({
      id: changelog.project,
    });
    const config = readConfig(changelog.configPath);
    const inputs = this.configService.getInput(
      config.inputs,
      config.options || config.inputs,
    );

    return {
      config,
      changelog: {
        ...changelog,
        statusEnum: StatusNum[changelog.status],
        projectName: project.name,
      },
      inputs,
      next,
    };
  }

  // 日志
  async log({ logPath, id, type = 'all' }: GetLogDto) {
    const changelog = await this.findOneBy(id);
    const next = nidleNext(changelog);

    if (!logPath) {
      if (type === 'error') {
        // TODO: 只返回错误日志，这块逻辑还有问题，格式也不好支持，先从展示层面考虑
        const config = readConfig(changelog.configPath);
        logPath = config.log.error;
      } else {
        /** @check changelog.log.all */
        // logPath = changelog.log.all; // changelog 没有 log 属性
      }
    }

    const logState = fs.statSync(logPath, {
      throwIfNoEntry: false,
    });

    if (!logState) {
      return;
    }

    let logRaw;
    logRaw = fs.readFileSync(logPath);
    logRaw = logRaw.toString().replace(/\n/g, ',');

    if (logRaw[logRaw.length - 1] === ',') {
      logRaw = logRaw.substr(0, logRaw.length - 1);
    }

    logRaw = '[' + logRaw + ']';
    const logs = JSON.parse(logRaw);
    const len = logs.length;

    const result: Record<string, any> = {
      status: changelog.status,
      statusEnum: StatusNum[changelog.status],
      stage: changelog.stage,
      next,
    };

    if (len > 1) {
      result.startTime = logs[0].time;
      result.duration = getDuration(logs[0].time, logs[len - 1].time);

      if (StatusNum[changelog.status] > StatusNum.PENDING) {
        result.endTime = logs[len - 1].time;

        if (!changelog.duration) {
          await this.changelogRepository.update(
            { id },
            { duration: result.duration },
          );
        }
      }

      // 分组
      const stages = [];
      transform(logs, stages, 0);

      return {
        ...result,
        stages,
      };
    } else {
      return result;
    }
  }

  async handleCodeReviewByMR({
    projectIds,
    mrProjectName,
    mrUserName,
    lastCommit,
    isMerged,
  }: CodeReviewDto): Promise<{ affectedId: number; dropIds: number[] }> {
    const res = { affectedId: -1, dropIds: [] };
    const changelogs = await this.changelogRepository.findBy({
      project: In(projectIds),
      commitId: lastCommit.id,
      codeReviewStatus: CodeReviewStatus.PENDING,
      active: 0,
    });
    if (changelogs.length) {
      // 默认取第一条进行 CR 状态更新
      const { id, developer, branch, project, environment } = changelogs[0];
      const { affected } = await this.changelogRepository.update(
        { id },
        {
          codeReviewStatus: isMerged
            ? CodeReviewStatus.SUCCESS
            : CodeReviewStatus.FAIL,
        },
      );
      if (affected) {
        res.affectedId = id;
        // CR结果通知
        const receiveUser = await this.userService.findOneBy(developer);
        const title = `CodeReview ${isMerged ? '通过' : '拒绝'}`;
        this.messageService.send({
          type: 'notification',
          title,
          content: `${mrProjectName}/${branch} ${title}; 创建人: ${lastCommit?.author?.name}; 处理人: ${mrUserName}`,
          body: {
            id: id,
            projectId: project,
            type: 'codereview',
            enviroment: environment,
          },
          timestamp: new Date().getTime(),
          users: [receiveUser.name || receiveUser.login],
        });
      }
      /**
       * [A]:[同一个仓库(git repo)的同一个提交查出多条处于 CR pending 的记录]
       * 属于错误的使用方式，说明配置了多个应用(Project)
       * 这种情况下[A], 应该将其配置到一个应用中统一发布
       */
      if (changelogs.length > 1) {
        res.dropIds = changelogs.slice(1).map(({ id }) => id);
        this.logger.error('handleCodeReviewByMR error:', {
          projectIds,
          changelogIds: changelogs.map(({ id }) => id),
          lastCommit,
          res,
        });
      }
    }
    return res;
  }

  async handleAutoDeployByMR(
    projects: Project[],
    targetBranch: string,
  ): Promise<{ startedIds: number[]; errorIds: number[] }> {
    const res = { startedIds: [], errorIds: [] };
    const changelogs = await this.changelogRepository.findBy({
      project: In(projects.map(({ id }) => id)),
      branch: targetBranch,
      active: 0,
      type: 'webhook',
    });
    if (changelogs.length) {
      for (const changelog of changelogs) {
        const {
          repositoryType,
          repositoryUrl,
          name: projectName,
          gitlabId,
        } = projects.find(({ id }) => id === changelog.project);
        try {
          // webhook发布
          // 1. 新建发布记录
          const newChangelog = await this.create(
            {
              id: changelog.id,
              branch: changelog.branch,
              type: changelog.type,
              projectId: changelog.project,
              mode: changelog.environment,
            },
            { repositoryType, repositoryUrl, projectName, gitlabId, changelog },
          );

          // 2. 开始构建
          const config = readConfig(changelog.configPath);
          await this.start(
            {
              id: newChangelog.changelog.id,
              configPath: newChangelog.changelog.configPath,
              inputs: config.inputs,
              options: config.options || [],
              notTransform: true,
            },
            newChangelog.changelog.environment,
          );
          res.startedIds.push(changelog.id);
        } catch (error) {
          // 某一条报错后不影响其他记录的发布
          res.errorIds.push(changelog.id);
          this.logger.error(
            `handleAutoDeployByMR error: changelog id = ${changelog.id}`,
            { error },
          );
        }
      }
    }
    return res;
  }

  async mergeHook(params: MergeHookDto) {
    const {
      project: mrProject,
      object_attributes: mrDetail,
      user: mrUser,
    } = params;
    /**
     * merged 表示 mr 通过
     * closed 表示代码审查者决定代码不能合并，关闭了 mr
     * 其他的 mr 状态直接跳过(return)
     */
    if (!['merged', 'closed'].includes(mrDetail.state)) {
      return { skip: true };
    }
    const isMerged = mrDetail.state === 'merged';
    // 一个仓库(git repo)可能配置多个应用(Project)
    const projects = await this.projectService.findAllByWhere({
      gitlabId: mrProject.id,
    });
    if (!projects.length) {
      const { id, name, web_url } = mrProject;
      throw new Error(`未识别的应用: ${JSON.stringify({ id, name, web_url })}`);
    }

    const crRes = await this.handleCodeReviewByMR({
      projectIds: projects.map(({ id }) => id),
      mrProjectName: mrProject.name,
      mrUserName: mrUser.name,
      lastCommit: mrDetail.last_commit,
      isMerged,
    });
    // cr 流程有命中则直接 return
    if (crRes.affectedId > -1 || !isMerged) return { crRes };
    // merged 状态的 mr 才去检查 webhook
    const adRes = await this.handleAutoDeployByMR(
      projects,
      mrDetail.target_branch,
    );
    return { crRes, adRes };
  }
}
