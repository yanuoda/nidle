import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';

import { LibModule } from './lib/lib.module';
import { SystemModule } from './system/system.module';
import configuration, { dbConfig } from './configuration';

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
    LibModule,
    SystemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
