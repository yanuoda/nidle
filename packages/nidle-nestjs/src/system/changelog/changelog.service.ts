import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService as NestConfigService, ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Not, Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
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
import {
  checkValue,
  readConfig,
  writeConfig,
  renameFileToBak,
  getFormatNow,
} from 'src/utils';
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
  CallQueueAndJobMethodDto,
  StartChangelogDto,
  StartParams,
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
    this.changelogQueue.on('stalled', (job: Job) => {
      try {
        job.update({ ...job.data, _stalled: true });
        job.log(
          `[${getFormatNow()}] job ${job.id} has been marked as stalled.`,
        );
      } catch (error) {
        this.logger.error('stalled error:', error);
      }
    });

    // this.changelogQueue.on('global:progress', async (jobId, data) => {
    //   console.log('global:progress', jobId, data);
    // });
    this.changelogQueue.on(
      'progress',
      (job: Job, data: number | Record<string, any>) => {
        if (typeof data === 'number') return;
        const { service, method, params = [] } = data;
        try {
          if (service === 'self') {
            this[method](...params);
          } else {
            this[service][method](...params);
          }
        } catch (e) {
          const error = JSON.stringify(e, Object.getOwnPropertyNames(e), 2);
          this.logger.error(`[${getFormatNow()}] queue progress error:`, {
            error,
            jobId: job.id,
            data,
          });
        }
      },
    );
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
  async deleteByIds(ids: number[], cascade?: boolean) {
    let affecteds = 0;
    for (const id of ids) {
      const changelog = await this.findOneBy(id);
      const { affected = 0 } = await this.changelogRepository.delete({ id });
      this.logger.info(`delete changelog:${id}`, {
        original: changelog,
        affected,
      });
      affecteds += affected;
      // 重命名相关文件（增加 '.bak' 后缀，可方便清理或恢复）
      renameFileToBak(changelog.configPath);
      renameFileToBak(changelog.logPath);

      if (cascade) {
        const children = await this.findAllByOpts({
          select: ['id'],
          where: {
            project: changelog.project,
            environment: changelog.environment,
            period: changelog.period,
            id: Not(changelog.id),
          },
        });
        if (children?.length > 0) {
          affecteds += await this.deleteByIds(children.map(({ id }) => id));
        }
      }
    }
    return affecteds;
  }

  async findAllByOpts(opts: FindManyOptions<Changelog>) {
    return await this.changelogRepository.find(opts);
  }

  async findAllByPage(opts: FindManyOptions<Changelog>) {
    return await this.changelogRepository.findAndCount(opts);
  }

  async findPublishGroupByPage(
    projectId: number,
    environment: string,
    current: number,
    pageSize: number,
  ) {
    /**
     * 基于 period 分组，取最新一条记录 MAX(id)
     */
    const baseSql = `
      SELECT MAX(id) AS id, COUNT(id) AS periodCount
      FROM changelog_v2
      WHERE project=${projectId} AND environment='${environment}'
      GROUP BY period
    `;
    const [{ total }] = await this.changelogRepository.query(`
      SELECT COUNT(*) AS total FROM (${baseSql}) tc
    `);
    /**
     * 基于分组后的数据id，查询对应记录，并 updatedTime 降序 及 分页
     */
    const list = await this.changelogRepository.query(
      `
        SELECT t1.*, t2.periodCount
        FROM changelog_v2 t1
        INNER JOIN (${baseSql}) t2 ON t1.id = t2.id
        ORDER BY t1.updatedTime DESC
        LIMIT ${(current - 1) * pageSize},${pageSize}
      `,
    );
    return [list, total] as [(Changelog & { periodCount: number })[], number];
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
    let _description = description;
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
      _description = changelog.description;
      commitId = commitId || changelog.commitId;
      options.repository.commitId = commitId;

      // 复用source、output
      const config = readConfig(changelog.configPath);

      options = {
        ...options,
        source: config.source,
        output: config.output,
      };
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
      ...(createConfig || {}),
    };
    let initConfig: Record<string, any> = {};
    if (createConfig) {
      const manager = new Nidle(extend(true, {}, config));
      initConfig = await manager.init();

      /**
       * 基于某个发布新建时
       * 保留 source 文件，可以避免重新 git clone + npm i，节省带宽占用及IO占用
       * 但是 output 需要清除，避免非生产环境的缓存累积（生产环境的缓存控制不在此环节，所以所有环境都要清除 output）
       * manager.clear: (reuse: boolean) => void; - reuse: 是否保留 source 以复用
       *
       * 普通发布时(type !== 'webhook')，只有 development 环境可以清除，其他环境会复用上一步的构建产物直接 scp
       */
      // if (id && (type === 'webhook' || mode === _const.environments[0].value)) {
      //   manager.clear(true);
      // }
      if (id) {
        if (type === 'webhook') {
          /**
           * webhook 没有 下一步
           * 先测试 development | pre 环境，理论上所有环境都可以
           */
          if (mode !== 'production') {
            // 保留 source，只清除 output，避免非生产环境的缓存累积
            manager.clear(true);
          } else {
            manager.clear();
          }
        } else {
          /**
           * 普通发布的 下一步 不清除文件，会复用上一步的构建产物直接 scp
           * 普通发布的 重新发布 会重置 mode=development，保留 source，只清除 output，避免非生产环境的缓存累积
           */
          if (mode === _const.environments[0].value) {
            manager.clear(true);
          }
        }
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
      source,
      // 如果没配置，即该环境没有构建任务，直接通过
      status: createConfig ? 'NEW' : 'SUCCESS',
      codeReviewStatus: 'NEW',
      environment: mode,
      configPath,
      active: 0,
      commitId,
      description: _description,
      pendingMR: 0,
    });
    if (user?.id) newChangelogInstance.developer = user?.id;
    if (createConfig) newChangelogInstance.logPath = config.log.all;

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
      // 解除环境占用
      await this.projectService.resetProjectServerOccupation(id);
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
    {
      environment,
      changelogType,
      changelogDesc,
      projectId,
      projectName,
    }: StartParams,
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
      'sepStart',
      {
        changelogId,
        config,
        options,
        environment,
        changelogType,
        changelogDesc,
        projectId,
        projectName,
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

  async createAndStart(
    changelog: Changelog,
    {
      repositoryType,
      repositoryUrl,
      name: projectName,
      gitlabId,
    }: Partial<Project>,
    user?: SessionUser,
  ) {
    // 1. 新建发布记录
    const { changelog: newChangelog } = await this.create(
      {
        id: changelog.id,
        branch: changelog.branch,
        type: changelog.type,
        projectId: changelog.project,
        mode: changelog.environment,
      },
      { repositoryType, repositoryUrl, projectName, gitlabId, changelog },
      user,
    );

    // 2. 开始构建
    const config = readConfig(changelog.configPath);
    await this.start(
      {
        id: newChangelog.id,
        configPath: newChangelog.configPath,
        inputs: config.inputs,
        options: config.options || [],
        notTransform: true,
      },
      {
        environment: newChangelog.environment,
        changelogType: newChangelog.type,
        changelogDesc: newChangelog.description,
        projectId: changelog.project,
        projectName,
      },
    );
    return newChangelog.id;
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
      // commit提交人: lastCommit?.author?.name
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
        const title = `应用: ${mrProjectName} CodeReview ${
          isMerged ? '通过' : '拒绝'
        }`;
        this.messageService.send({
          type: 'notification',
          title,
          content: `分支: ${branch} ${title} | 处理人: ${mrUserName}`,
          body: {
            id: id,
            type: `code-review-${isMerged ? 'success' : 'fail'}`,
            environment,
            projectId: project,
          },
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
    const res = { startedIds: [], errorIds: [], pendingIds: [] };
    const changelogs = await this.changelogRepository.findBy({
      project: In(projects.map(({ id }) => id)),
      branch: targetBranch,
      active: 0,
      type: 'webhook',
      status: Not(Status.NEW), // 过滤新建的发布记录，此时前端还没有提交保存 inputs，无法进行发布
    });
    if (changelogs.length) {
      for (const changelog of changelogs) {
        const {
          repositoryType,
          repositoryUrl,
          name: projectName,
          gitlabId,
        } = projects.find(({ id }) => id === changelog.project);
        const _env = _const.environments.find(
          (item) => item.value === changelog.environment,
        );
        const msgTitle = `应用: ${projectName} [${_env.label}环境]`;
        const msgContent = `分支: ${changelog.branch} | 发布id: ${
          changelog.id
        } ${changelog.description || ''}`;
        if (
          // 构建中的 MR
          changelog.status === Status.PENDING ||
          // 生产环境的 webhook
          changelog.environment === 'production'
        ) {
          /** MR 累积 */
          await this.changelogRepository.update(
            { id: changelog.id },
            { pendingMR: (changelog.pendingMR || 0) + 1 },
          );
          this.messageService.send({
            type: 'notification',
            title: `${msgTitle} 发布待确认`,
            content: `未自动发布，请手动确认 | ${msgContent}`,
            body: {
              id: changelog.id,
              type: 'publish-start',
              environment: changelog.environment,
              projectId: changelog.project,
            },
          });
          res.pendingIds.push(changelog.id);
          continue;
        }
        try {
          // webhook发布
          await this.createAndStart(changelog, {
            repositoryType,
            repositoryUrl,
            name: projectName,
            gitlabId,
          });
          res.startedIds.push(changelog.id);
        } catch (error) {
          // 某一条报错后不影响其他记录的发布
          this.messageService.send({
            type: 'notification',
            title: `${msgTitle} webhook 响应失败`,
            content: `未能正常触发自动发布，请检查 | ${msgContent}`,
            body: {
              id: changelog.id,
              type: 'publish-fail',
              environment: changelog.environment,
              projectId: changelog.project,
            },
          });
          this.logger.error(
            `handleAutoDeployByMR error: changelog id = ${changelog.id}`,
            { error },
          );
          res.errorIds.push(changelog.id);
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

  async callQueueMethodBy({ method, params }: CallQueueAndJobMethodDto) {
    if (!this.changelogQueue[method]) {
      throw new Error(`queue [${method}] is undefined.`);
    }
    const data = await this.changelogQueue[method](...params);
    return JSON.stringify(data, Object.getOwnPropertyNames(data), 2);
  }

  async callJobMethodBy({ ids, method, params }: CallQueueAndJobMethodDto) {
    const data: Record<number, string> = {};
    for (const id of ids) {
      const job = await this.changelogQueue.getJob(id);
      if (!job[method]) throw new Error(`job [${method}] is undefined.`);
      const jobdata = await job[method](...params);
      data[id] = JSON.stringify(
        jobdata,
        Object.getOwnPropertyNames(jobdata),
        2,
      );
    }
    return data;
  }
}
