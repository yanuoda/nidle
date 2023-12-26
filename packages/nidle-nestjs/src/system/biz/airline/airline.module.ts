import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModule } from 'src/system/project/project.module';
import { AirlinePublishService } from './airline_publish.service';
import { AirlinePublishController } from './airline_publish.controller';
import { AirlinePublish } from './airline_publish.entity';

@Module({
  controllers: [AirlinePublishController],
  providers: [AirlinePublishService],
  imports: [TypeOrmModule.forFeature([AirlinePublish]), ProjectModule],
  exports: [AirlinePublishService],
})
export class AirlineModule {}
