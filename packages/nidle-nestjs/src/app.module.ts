import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SystemModule } from './system/system.module';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: configuration }),
    SystemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
