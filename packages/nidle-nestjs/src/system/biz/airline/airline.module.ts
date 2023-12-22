import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModule } from 'src/system/project/project.module';
import { AirlineService } from './airline_publish.service';
import { AirlineController } from './airline_publish.controller';
import { AirlinePublish } from './airline_publish.entity';

@Module({
  controllers: [AirlineController],
  providers: [AirlineService],
  imports: [TypeOrmModule.forFeature([AirlinePublish]), ProjectModule],
})
export class AirlineModule {}
