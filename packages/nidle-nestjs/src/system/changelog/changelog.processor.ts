import { Inject } from '@nestjs/common';
import { ConfigType, ConfigService as NestConfigService } from '@nestjs/config';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as Nidle from 'nidle';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import _const from 'src/const';
import { asyncWait } from 'src/utils';
import { nidleConfig } from 'src/configuration';
import { ProjectService } from '../project/project.service';
// import { Changelog } from './changelog.entity';
import { ChangelogService } from './changelog.service';
import { MessageService } from '../message/message.service';

@Processor('changelog')
export class ChangelogProcessor {
  afterManagerWaitSecs: number;
  constructor(
    private readonly nestConfigService: NestConfigService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly projectService: ProjectService,
    private readonly changelogService: ChangelogService,
    private readonly messageService: MessageService,
  ) {
    const _nidleConfig: ConfigType<typeof nidleConfig> =
      this.nestConfigService.get('nidleConfig');
    this.afterManagerWaitSecs = Number(_nidleConfig.afterManagerWaitSecs);
  }

  @Process({ name: 'start', concurrency: _const.queueConcurrency })
  async handleStart(job: Job) {
    const { config, options, changelogId, environment } = job.data;
    const _env = _const.environments.find((item) => item.value === environment);
    const manager = new Nidle({ ...config });
    const changelog = await this.changelogService.findOneBy(changelogId);
    const project = await this.projectService.findOne({
      id: changelog.project,
    });
    const msgTitle = `应用:${project.name} [${_env.label}环境] `;
    const msgContent = `git项目: ${config.name} / 分支: ${config.repository.branch} / 创建人: ${config.repository.userName}`;

    await manager.init();
    await manager.mount(options, (_data) => {
      if (_data.codeReviewStatus === 'PENDING') {
        // CR 发起通知
        this.messageService.send({
          type: 'event',
          title: 'CodeReview 发起',
          content: msgContent,
          body: {
            id: changelogId,
            projectId: changelog.project,
            type: 'code-review-request',
            enviroment: environment,
          },
          timestamp: new Date().getTime(),
        });
      }
      const stageIndex = config.stages.findIndex(
        ({ name }) => name === _data.stage,
      );
      if (stageIndex > 0) {
        job.progress(Math.ceil((stageIndex / config.stages.length) * 100));
      }
      job.log(
        `manager.mount update changelog:${changelogId} with data:${JSON.stringify(
          _data,
        )}`,
      );
      return this.changelogService.updateOne(changelogId, _data);
    });

    const afterManagerStart = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        manager.on('completed', async () => {
          // 发布成功消息
          this.messageService.send({
            type: 'notification',
            title: `${msgTitle}发布成功`,
            content: msgContent,
            body: {
              id: changelogId,
              projectId: changelog.project,
              type: 'publish-success',
              enviroment: environment,
            },
            timestamp: new Date().getTime(),
          });
          if (
            environment ===
            _const.environments[_const.environments.length - 1].value
          ) {
            // 生产结束要释放资源
            // 解除环境占用
            await this.projectService.resetProjectServerOccupation(changelogId);
            await manager.backup();
          }
          job.progress(98);
          await asyncWait(1000 * this.afterManagerWaitSecs);
          await job.progress(100);
          resolve();
        });

        manager.on('error', async (e) => {
          // 发布失败消息
          this.messageService.send({
            type: 'notification',
            title: `${msgTitle}发布失败`,
            content: msgContent,
            body: {
              id: changelogId,
              projectId: changelog.project,
              type: 'publish-fail',
              enviroment: environment,
            },
            timestamp: new Date().getTime(),
          });
          const info = `changelogProcessor error - changelogId:${changelogId} | environment:${environment}`;
          const error = JSON.stringify(e);
          this.logger.error(info, { error });
          job.log(error);
          await asyncWait(1000 * this.afterManagerWaitSecs);
          reject(new Error(info));
        });
      });
    };

    // 发布开始消息
    this.messageService.send({
      type: 'notification',
      title: `${msgTitle}发布开始`,
      content: msgContent,
      body: {
        id: changelogId,
        projectId: changelog.project,
        type: 'publish-start',
        enviroment: environment,
      },
      timestamp: new Date().getTime(),
    });
    await manager.start();
    await afterManagerStart();
  }
}
