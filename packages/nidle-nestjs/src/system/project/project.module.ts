import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from './entities/project.entity';
import { ProjectServer } from './entities/project_server.entity';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [TypeOrmModule.forFeature([Project, ProjectServer])],
})
export class ProjectModule {}
