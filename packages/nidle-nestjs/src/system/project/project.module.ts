import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChangelogModule } from '../changelog/changelog.module';
import { UserModule } from '../user/user.module';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from './entities/project.entity';
import { ProjectServer } from './entities/project_server.entity';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [
    TypeOrmModule.forFeature([Project, ProjectServer]),
    ChangelogModule,
    UserModule,
  ],
  exports: [ProjectService],
})
export class ProjectModule {}
