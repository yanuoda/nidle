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

const modules = [
  ServerModule,
  TemplateModule,
  ProjectModule,
  UserModule,
  ChangelogModule,
  ConfigModule,
  OauthModule,
  MessageModule,
];

@Module({
  imports: [
    ...modules,
    RouterModule.register(modules.map((module) => ({ path: '/api', module }))),
  ],
})
export class SystemModule {}
