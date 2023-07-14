import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { Template } from './template.entity';

@Module({
  controllers: [TemplateController],
  providers: [TemplateService],
  imports: [TypeOrmModule.forFeature([Template])],
  exports: [TemplateService],
})
export class TemplateModule {}
