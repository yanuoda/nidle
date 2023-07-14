import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { ProjectModule } from '../project/project.module';
import { ServerModule } from '../server/server.module';
import { ConfigModule } from '../config/config.module';
import { ChangelogController } from './changelog.controller';
import { ChangelogProcessor } from './changelog.processor';
import { ChangelogService } from './changelog.service';
import { Changelog } from './changelog.entity';

@Module({
  controllers: [ChangelogController],
  providers: [ChangelogService, ChangelogProcessor],
  imports: [
    TypeOrmModule.forFeature([Changelog]),
    BullModule.registerQueue({
      name: 'changelog',
    }),
    ProjectModule,
    ServerModule,
    ConfigModule,
  ],
})
export class ChangelogModule {}
