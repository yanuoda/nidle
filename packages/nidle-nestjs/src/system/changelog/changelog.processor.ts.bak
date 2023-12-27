import { Inject } from '@nestjs/common';
import { ConfigType, ConfigService as NestConfigService } from '@nestjs/config';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as Nidle from 'nidle';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import _const from 'src/const';
import { asyncWait, getFormatNow } from 'src/utils';
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

  @Process({ name: 'start', concurrency: 1 })
  async handleStart(job: Job) {
    const {
      changelogId,
      config,
      options,
      environment,
      changelogDesc,
      projectId,
      projectName,
    } = job.data;
    const _env = _const.environments.find((item) => item.value === environment);
    const manager = new Nidle({ ...config });
    const msgTitle = `应用: ${projectName} [${_env.label}环境] `;
    let msgContent = `分支: ${config.repository.branch} | 创建人: ${config.repository.userName} | 发布id: ${changelogId}`;
    if (changelogDesc) {
      msgContent += ` | 描述: ${changelogDesc}`;
    }

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
            type: 'code-review-request',
            environment,
            projectId,
          },
        });
      }
      const stageIndex = config.stages.findIndex(
        ({ name }) => name === _data.stage,
      );
      if (stageIndex > 0) {
        job.progress(Math.ceil((stageIndex / config.stages.length) * 100));
      }
      job.log(
        `[${getFormatNow()}] manager.mount update changelog:${changelogId} with data:${JSON.stringify(
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
              type: 'publish-success',
              environment,
              projectId,
            },
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
          await job.progress(100);
          /**
           * 默认情况下 resolve() 以后会自动移动到 Completed
           * 但构建任务时间长，容易被 bull 标记成 stalled, 同时因为我们的 settings: { stalledInterval: 0 }
           * 不会去检查 stalled 的 job （检查到了会自动重新运行，我们的构建任务并不支持）
           * 导致 stalled job 会一直停留在 active（其实构建子进程运行已正常完成构建）
           * 故手动移动 job 至 Completed 确保状态正常
           */
          if (job.data._stalled) {
            job.moveToCompleted('stalled move', true).catch((e) => {
              job.log(
                'stalled move err: ' +
                  JSON.stringify(e, Object.getOwnPropertyNames(e), 2),
              );
            });
          }
          await asyncWait(1000 * this.afterManagerWaitSecs);
          resolve();
        });

        manager.on('error', async (e: Error) => {
          // 发布失败消息
          this.messageService.send({
            type: 'notification',
            title: `${msgTitle}发布失败`,
            content: msgContent,
            body: {
              id: changelogId,
              type: 'publish-fail',
              environment,
              projectId,
            },
          });
          const info = `changelogProcessor error - changelogId:${changelogId} | environment:${environment}`;
          // const error = JSON.stringify(e); // Error 对象的 stack/message 为不可枚举的属性，此代码运行结果为 '{}'
          const error = JSON.stringify(e, Object.getOwnPropertyNames(e), 2);
          this.logger.error(info, { error });
          job.log(`[${getFormatNow()}] ${info}`);
          job.log(error);
          // 理由见上面 ↑ job.moveToCompleted()
          if (job.data._stalled) {
            job.moveToFailed({ message: info }, true).catch((e) => {
              job.log(
                'stalled move err: ' +
                  JSON.stringify(e, Object.getOwnPropertyNames(e), 2),
              );
            });
          }
          await asyncWait(1000 * this.afterManagerWaitSecs);
          reject(e);
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
        type: 'publish-start',
        environment,
        projectId,
      },
    });
    await manager.start();
    await afterManagerStart();
  }
}
