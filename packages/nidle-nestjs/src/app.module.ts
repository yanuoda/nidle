import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';

import { LibModule } from './lib/lib.module';
import { SystemModule } from './system/system.module';
import configuration, { dbConfig, redisConfig } from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: configuration }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const _dbConfig: ConfigType<typeof dbConfig> =
          configService.get('dbConfig');
        return {
          type: 'mysql',
          host: _dbConfig.host,
          port: Number(_dbConfig.port),
          username: _dbConfig.user,
          password: _dbConfig.pass,
          database: _dbConfig.database,
          charset: 'utf8_bin', // 使用中的数据库设置
          // charset: 'utf8mb4', // 最佳实践
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: process.env.DEV === 'true',
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const _redisConfig: ConfigType<typeof redisConfig> =
          configService.get('redisConfig');
        return {
          redis: {
            host: _redisConfig.host,
            port: Number(_redisConfig.port),
            password: _redisConfig.pass,
            db: Number(_redisConfig.dbIndex),
          },
          prefix: 'nidle-queues:',
        };
      },
      inject: [ConfigService],
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    LibModule,
    SystemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
