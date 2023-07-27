import { Module, forwardRef } from '@nestjs/common';

import { TemplateModule } from '../template/template.module';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';
import { ProjectModule } from '../project/project.module';

@Module({
  controllers: [ConfigController],
  providers: [ConfigService],
  imports: [TemplateModule, forwardRef(() => ProjectModule)],
  exports: [ConfigService],
})
export class ConfigModule {}
