import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServerController } from './server.controller';
import { ServerService } from './server.service';
import { Server } from './server.entity';

@Module({
  controllers: [ServerController],
  providers: [ServerService],
  imports: [TypeOrmModule.forFeature([Server])],
  exports: [ServerService],
})
export class ServerModule {}
