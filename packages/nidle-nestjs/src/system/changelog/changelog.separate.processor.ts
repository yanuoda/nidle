import { Job, DoneCallback } from 'bull';
import * as Nidle from 'nidle';

import _const from 'src/const';
import { getFormatNow } from 'src/utils';

export default async function (job: Job, cb: DoneCallback) {
  // console.log(job.queue); // undefined
  // await job.progress({ a: 111, pid: process.pid });
  // await job.progress(80);
  // console.log(`[${process.pid}] ${JSON.stringify(job.data)}`);
  // cb(null, 'It works');
  try {
    const {
      changelogId,
      config,
      options,
      environment,
      changelogType,
      changelogDesc,
      projectId,
      projectName,
    } = job.data;
    const _env = _const.environments.find((item) => item.value === environment);
    const manager = new Nidle({ ...config });
    const msgTitle = `应用: ${projectName} [${_env.label}环境] `;
    const isAutoCreate = config.repository.userName === 'webhook';
    const msgContent = [
      `分支: ${config.repository.branch}`,
      `提交人: ${config.repository.committer}`,
      isAutoCreate ? '自动创建' : `创建人: ${config.repository.userName}`,
      `发布id: ${changelogId}`,
      changelogDesc ? `描述: ${changelogDesc}` : null,
    ]
      .filter(Boolean)
      .join(' | ');

    await manager.init();
    await manager.mount(options, (_data) => {
      if (_data.codeReviewStatus === 'PENDING') {
        // CR 发起通知
        job.progress({
          service: 'messageService',
          method: 'send',
          params: [
            {
              type: 'event',
              title: 'CodeReview 发起',
              content: msgContent,
              body: {
                id: changelogId,
                type: 'code-review-request',
                environment,
                projectId,
              },
            },
          ],
        });
      }
      job.log(
        `[${getFormatNow()}] manager.mount update changelog:${changelogId} with data:${JSON.stringify(
          _data,
        )}`,
      );
      job.progress({
        service: 'self',
        method: 'updateOne',
        params: [changelogId, _data],
      });
      const stageIndex = config.stages.findIndex(
        ({ name }) => name === _data.stage,
      );
      if (stageIndex > 0) {
        job.progress(Math.ceil((stageIndex / config.stages.length) * 100));
      }
    });

    // const afterManagerStart = (): Promise<void> => {
    //   return new Promise((resolve, reject) => {
    //   });
    // };

    // 发布开始消息
    job.progress({
      service: 'messageService',
      method: 'send',
      params: [
        {
          type: 'notification',
          title: `${msgTitle}发布开始`,
          content: msgContent,
          body: {
            id: changelogId,
            type: 'publish-start',
            environment,
            projectId,
          },
        },
      ],
    });
    await manager.start();
    // await afterManagerStart();
    manager.on('completed', async () => {
      // 发布成功消息
      job.progress({
        service: 'messageService',
        method: 'send',
        params: [
          {
            type: 'notification',
            title: `${msgTitle}发布成功`,
            content: msgContent,
            body: {
              id: changelogId,
              type: 'publish-success',
              environment,
              projectId,
            },
          },
        ],
      });
      if (
        // 生产环境
        environment ===
          _const.environments[_const.environments.length - 1].value &&
        // 非 webhook 类型的发布
        changelogType !== 'webhook'
      ) {
        // 解除环境占用
        job.progress({
          service: 'projectService',
          method: 'resetProjectServerOccupation',
          params: [changelogId],
        });
        // 清理生成的文件
        await manager.backup();
      }
      await job.progress(100);
      // await asyncWait(1000 * this.afterManagerWaitSecs);
      // resolve();
      cb(null, true);
    });

    manager.on('error', async (e: Error) => {
      // 发布失败消息
      job.progress({
        service: 'messageService',
        method: 'send',
        params: [
          {
            type: 'notification',
            title: `${msgTitle}发布失败`,
            content: msgContent,
            body: {
              id: changelogId,
              type: 'publish-fail',
              environment,
              projectId,
            },
          },
        ],
      });
      const info = `changelogProcessor error - changelogId:${changelogId} | environment:${environment}`;
      // const error = JSON.stringify(e); // Error 对象的 stack/message 为不可枚举的属性，此代码运行结果为 '{}'
      const error = JSON.stringify(e, Object.getOwnPropertyNames(e), 2);
      job.progress({
        service: 'logger',
        method: 'error',
        params: [info, { error }],
      });
      job.log(`[${getFormatNow()}] ${info}`);
      job.log(error);
      // await asyncWait(1000 * this.afterManagerWaitSecs);
      // reject(e);
      cb(e);
    });

    // cb(null, true);
  } catch (error) {
    cb(error);
  }
}
