import { Module } from '@nestjs/common';
import { ServerModule } from './server/server.module';
import { TemplateModule } from './template/template.module';

@Module({
  imports: [ServerModule, TemplateModule],
})
export class SystemModule {}
