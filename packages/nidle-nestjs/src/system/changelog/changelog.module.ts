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
      imports: [NestConfigModule],
      inject: [NestConfigService],
      useFactory: (configService: NestConfigService) => {
        const _queueConfig: ConfigType<typeof queueConfig> =
          configService.get('queueConfig');
        return {
          name: 'changelog',
          limiter: {
            max: Number(_queueConfig.changelog.max),
            duration: Number(_queueConfig.changelog.duration),
          },
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
