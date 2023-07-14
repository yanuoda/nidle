import { Module } from '@nestjs/common';

import { TemplateModule } from '../template/template.module';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';

@Module({
  controllers: [ConfigController],
  providers: [ConfigService],
  imports: [TemplateModule],
  exports: [ConfigService],
})
export class ConfigModule {}
