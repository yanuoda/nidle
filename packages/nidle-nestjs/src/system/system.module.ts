import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ServerModule } from './server/server.module';
import { TemplateModule } from './template/template.module';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';
import { ChangelogModule } from './changelog/changelog.module';
import { ConfigModule } from './config/config.module';
import { OauthModule } from './oauth/oauth.module';
import { MessageModule } from './message/message.module';
import { ApiauthModule } from './apiauth/apiauth.module';
import { AirlineModule } from './biz/airline/airline.module';

const modules = [
  ServerModule,
  TemplateModule,
  ProjectModule,
  UserModule,
  ChangelogModule,
  ConfigModule,
  OauthModule,
  MessageModule,
  AirlineModule,
  ApiauthModule,
];

@Module({
  imports: [
    ...modules,
    RouterModule.register(modules.map((module) => ({ path: '/api', module }))),
  ],
})
export class SystemModule {}
