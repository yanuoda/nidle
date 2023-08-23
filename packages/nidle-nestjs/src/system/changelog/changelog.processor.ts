import { Inject } from '@nestjs/common';
import { ConfigType, ConfigService as NestConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as Nidle from 'nidle';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import _const from 'src/const';
import { asyncWait } from 'src/utils';
import { nidleConfig } from 'src/configuration';
import { ProjectService } from '../project/project.service';
import { Changelog } from './changelog.entity';
import { ChangelogService } from './changelog.service';
import { MessageService } from '../message/message.service';

@Processor('changelog')
export class ChangelogProcessor {
  afterManagerWaitSecs: number;
  constructor(
    private readonly projectService: ProjectService,
    private readonly nestConfigService: NestConfigService,
    @InjectRepository(Changelog)
    private readonly changelogRepository: Repository<Changelog>,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
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
    await manager.init();
    await manager.mount(options, (_data) => {
      if (_data.codeReviewStatus === 'PENDING') {
        // CR 发起通知
        this.messageService.send({
          type: 'event',
          title: 'CodeReview 发起',
          content: `${config.name}/${config.repository.branch} 需要 CodeReview; 发起人: ${config.repository.userName};`,
          body: {
            id: changelogId,
            projectId: changelog.project,
            type: 'codereview',
            enviroment: environment,
          },
          timestamp: new Date().getTime(),
        });
      }
      job.log(
        `manager.mount update changelog:${changelogId} with data:${JSON.stringify(
          _data,
        )}`,
      );
      const stageIndex = config.stages.findIndex(
        ({ name }) => name === _data.stage,
      );
      if (stageIndex > 0) {
        job.progress(Math.ceil((stageIndex / config.stages.length) * 100));
      }
      return this.changelogRepository.update({ id: changelogId }, _data);
    });

    const afterManagerStart = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        manager.on('completed', async () => {
          console.log('ssssssssssssssuccess');
          // 发布成功消息
          this.messageService.send({
            type: 'notification',
            title: `[${_env.label}环境] 发布成功`,
            content: `[${_env.label}环境] ${config.name}/${config.repository.branch} 发布成功; 创建人: ${config.repository.userName}`,
            body: {
              id: changelogId,
              projectId: changelog.project,
              type: 'publish',
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
          await Promise.all([
            job.progress(100),
            asyncWait(1000 * this.afterManagerWaitSecs),
          ]);
          resolve();
        });

        manager.on('error', async (e) => {
          // 发布失败消息
          this.messageService.send({
            type: 'notification',
            title: `[${_env.label}环境] 发布失败`,
            content: `[${_env.label}环境] ${config.name}/${config.repository.branch} 发布失败; 创建人: ${config.repository.userName}`,
            body: {
              id: changelogId,
              projectId: changelog.project,
              type: 'publish',
              enviroment: environment,
            },
            timestamp: new Date().getTime(),
          });
          const info = `changelogProcessor error - changelogId:${changelogId} | environment:${environment}`;
          const error = JSON.stringify(e);
          this.logger.error(info, { error });
          await Promise.all([
            job.log(error),
            asyncWait(1000 * this.afterManagerWaitSecs),
          ]);
          reject(new Error(info));
        });
      });
    };

    // 发布开始消息
    this.messageService.send({
      type: 'notification',
      title: `[${_env.label}环境] 发布开始`,
      content: `[${_env.label}环境] ${config.name}/${config.repository.branch} 发布开始; 创建人: ${config.repository.userName}`,
      body: {
        id: changelogId,
        projectId: changelog.project,
        type: 'publish',
        enviroment: environment,
      },
      timestamp: new Date().getTime(),
    });
    await manager.start();
    await afterManagerStart();
  }
}
