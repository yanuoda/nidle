import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

import configuration, {
  dbConfig,
  redisConfig,
  nidleConfig,
} from './configuration';
import { AllExceptionFilter } from './filter';
import { ResponseInterceptor } from './interceptor';
import { LibModule } from './lib/lib.module';
import { SystemModule } from './system/system.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: configuration }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
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
          timezone: '+08:00',
        };
      },
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
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
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const _nidleConfig: ConfigType<typeof nidleConfig> =
          configService.get('nidleConfig');
        return {
          transports: [
            new winston.transports.DailyRotateFile({
              dirname: `${_nidleConfig.log.path}app`, // 日志保存的目录
              filename: '%DATE%.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
              datePattern: 'YYYY-MM-DD', // 日志轮换的频率，此处表示每天。
              zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
              maxSize: '20m', // 设置日志文件的最大大小，m 表示 mb 。
              maxFiles: '14d', // 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件。
              // 记录时添加时间戳信息
              format: winston.format.combine(
                winston.format.timestamp({
                  format: 'YYYY-MM-DD HH:mm:ss',
                }),
                winston.format.json(),
              ),
            }),
          ],
        };
      },
    }),
    LibModule,
    SystemModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
