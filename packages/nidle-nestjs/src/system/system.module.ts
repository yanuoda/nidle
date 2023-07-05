import { Module } from '@nestjs/common';
import { ServerModule } from './server/server.module';
import { TemplateModule } from './template/template.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [ServerModule, TemplateModule, ProjectModule],
})
export class SystemModule {}
