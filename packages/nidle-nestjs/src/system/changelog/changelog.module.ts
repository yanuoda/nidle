import { join } from 'path';
import { Module, forwardRef } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigService as NestConfigService,
  ConfigType,
} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';

import _const from 'src/const';
import { queueConfig } from 'src/configuration';
import { ProjectModule } from '../project/project.module';
import { ServerModule } from '../server/server.module';
import { ConfigModule } from '../config/config.module';
import { ChangelogController } from './changelog.controller';
import { ChangelogProcessor } from './changelog.processor';
import { ChangelogService } from './changelog.service';
import { Changelog } from './changelog.entity';
import { MessageModule } from '../message/message.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [ChangelogController],
  providers: [ChangelogService, ChangelogProcessor],
  imports: [
    TypeOrmModule.forFeature([Changelog]),
    BullModule.registerQueueAsync({
      name: 'changelog',
      imports: [NestConfigModule],
      inject: [NestConfigService],
      useFactory: (configService: NestConfigService) => {
        const _queueConfig: ConfigType<typeof queueConfig> =
          configService.get('queueConfig');
        return {
          limiter: {
            max: Number(_queueConfig.changelog.max),
            duration: Number(_queueConfig.changelog.duration),
          },
          settings: { stalledInterval: 0 },
          processors: [
            {
              name: 'sepStart',
              concurrency: _const.queueConcurrency,
              path: join(__dirname, 'changelog.separate.processor.js'),
            },
          ],
        };
      },
    }),
    BullBoardModule.forFeature({
      name: 'changelog',
      adapter: BullAdapter,
    }),
    forwardRef(() => ProjectModule),
    ServerModule,
    forwardRef(() => ConfigModule),
    MessageModule,
    UserModule,
  ],
  exports: [ChangelogService],
})
export class ChangelogModule {}
