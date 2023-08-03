import { ConfigType, ConfigService as NestConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as Nidle from 'nidle';

import _const from 'src/const';
import { asyncWait } from 'src/utils';
import { nidleConfig } from 'src/configuration';
import { ProjectService } from '../project/project.service';
import { Changelog } from './changelog.entity';

@Processor('changelog')
export class ChangelogProcessor {
  afterManagerWaitSecs: number;
  constructor(
    private readonly projectService: ProjectService,
    private readonly nestConfigService: NestConfigService,
    @InjectRepository(Changelog)
    private readonly changelogRepository: Repository<Changelog>,
  ) {
    const _nidleConfig: ConfigType<typeof nidleConfig> =
      this.nestConfigService.get('nidleConfig');
    this.afterManagerWaitSecs = Number(_nidleConfig.afterManagerWaitSecs);
  }

  @Process('start')
  async handleStart(job: Job) {
    const { config, options, changelogId, environment } = job.data;
    console.log(
      `changelogProcessor handleStart - changelogId:${changelogId} | environment:${environment}`,
    );
    const manager = new Nidle({ ...config });
    await manager.init();
    await manager.mount(options, (_data) => {
      return this.changelogRepository.update({ id: changelogId }, _data);
    });

    const afterManagerStart = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        manager.on('completed', async () => {
          if (
            environment ===
            _const.environments[_const.environments.length - 1].value
          ) {
            // 生产结束要释放资源
            // 解除环境占用
            await this.projectService.resetProjectServerOccupation(changelogId);
            await manager.backup();
          }
          console.log(
            `changelogProcessor completed - changelogId:${changelogId} | environment:${environment}`,
          );
          await asyncWait(1000 * this.afterManagerWaitSecs);
          await job.progress(100);
          resolve();
        });

        manager.on('error', async (e) => {
          let info = `changelogProcessor error - changelogId:${changelogId} | environment:${environment}`;
          info += '\n' + JSON.stringify(e);
          console.log(info);
          await asyncWait(1000 * this.afterManagerWaitSecs);
          reject(new Error(info));
        });
      });
    };

    await manager.start();
    await afterManagerStart();
  }
}
