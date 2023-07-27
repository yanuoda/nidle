import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService as NestConfigService, ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as path from 'path';
import fs from 'fs';
import * as extend from 'extend';
import { cloneDeep } from 'lodash';
import * as Nidle from 'nidle';

import _const from 'src/const';
import { SessionUser } from 'src/common/base.dto';
import { GitlabService } from 'src/lib/gitlab.service';
import { nidleConfig } from 'src/configuration';
import { readConfig, writeConfig } from 'src/utils';
import nidleNext from 'src/utils/nidleNest';
import { getDuration, transform } from 'src/utils/log';

import { ProjectService } from '../project/project.service';
import { ServerService } from '../server/server.service';
import { ConfigService } from '../config/config.service';
import {
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
  ) {
    this._nidleConfig = this.nestConfigService.get('nidleConfig');
  }

  async findOneBy(id: number) {
    const changelog = await this.changelogRepository.findOneBy({
      id,
    });
    if (!changelog) {
      throw new Error(`发布记录id:${id}不存在`);
    }
    return changelog;
  }

  async findAllBy(opts: FindManyOptions<Changelog>) {
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
    user: SessionUser,
  ) {
    const { repositoryType, repositoryUrl, projectName, gitlabId } =
      await this.checkAndGetProjectInfo(projectId, user);

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
      project: { gitlabId, repositoryType, repositoryUrl },
      mode,
      branch,
      type,
      isNew: !id,
      projectPublishFileKey,
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

    for (let i = 0, len = answers.length; i < len; i++) {
      const step = answers[i];

      // 特殊标识，用来标识type=servers的字段，以在使用时添加私密信息
      if (step._serversKey) {
        const serverList = [];

        for (
          let j = 0, slen = step.options[step._serversKey].length;
          j < slen;
          j++
        ) {
          const item = step.options[step._serversKey][j];

          if (typeof item.serverId === 'undefined') {
            // 查找serverId
            const projectServer = await this.projectService.findProjectServerBy(
              {
                id: item.id,
              },
            );
            item.serverId = projectServer.server;
          }
          // 更新服务器被占用
          await this.projectService.updateProjectServer({
            id: item.id,
            changelog: changelogId,
          });

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

    this.changelogQueue.add('start', {
      config,
      options,
      changelogId,
      environment,
    });

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
    const changelog = await this.changelogRepository.findOneBy({ id });
    const next = nidleNext(changelog);

    if (!logPath) {
      if (type === 'error') {
        // TODO: 只返回错误日志，这块逻辑还有问题，格式也不好支持，先从展示层面考虑
        const config = readConfig(changelog.configPath);
        logPath = config.log.error;
      } else {
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

  async mergeHook(params: MergeHookDto, user: SessionUser) {
    const { project, object_attributes: detail } = params;
    if (detail.state === 'merged' || detail.state === 'closed') {
      const pj = await this.projectService.findOne({
        name: project.name,
      });

      if (!pj) {
        throw new Error(`未识别的应用: ${project.name}`);
      }

      // 先查找是不是codeReview的
      const changelog = await this.changelogRepository.findOneBy({
        project: pj.id,
        commitId: detail.last_commit.id,
        codeReviewStatus: CodeReviewStatus.PENDING,
        active: 0,
      });

      if (changelog) {
        // code review
        await this.changelogRepository.update(
          { id: changelog.id },
          {
            codeReviewStatus:
              detail.state === 'merged'
                ? CodeReviewStatus.SUCCESS
                : CodeReviewStatus.FAIL,
          },
        );

        return true;
      }

      if (detail.state === 'closed') {
        return;
      }

      // 再查找是不是webhook的
      const changelogs = await this.changelogRepository.findBy({
        project: pj.id,
        branch: detail.target_branch,
        active: 0,
        type: 'webhook',
      });

      if (!changelogs.length) {
        throw new Error(`找不到相关记录: ${detail.last_commit.id}`);
      }

      for (const changelog of changelogs) {
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
          user,
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
      }

      return true;
    }
  }
}
