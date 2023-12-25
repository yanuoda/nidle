import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiauthService } from './apiauth.service';
import { ApiauthController } from './apiauth.controller';
import { Apiauth } from './apiauth.entity';

@Module({
  controllers: [ApiauthController],
  providers: [ApiauthService],
  imports: [TypeOrmModule.forFeature([Apiauth])],
})
export class ApiauthModule {}
