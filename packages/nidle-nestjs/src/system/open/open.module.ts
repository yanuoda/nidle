import { Module } from '@nestjs/common';

import { ApiauthModule } from 'src/system/apiauth/apiauth.module';
import { AirlineModule } from 'src/system/biz/airline/airline.module';
import { OpenService } from './open.service';
import { OpenController } from './open.controller';

@Module({
  controllers: [OpenController],
  providers: [OpenService],
  imports: [ApiauthModule, AirlineModule],
})
export class OpenModule {}
