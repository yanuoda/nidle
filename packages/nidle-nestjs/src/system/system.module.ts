import { Module } from '@nestjs/common';
import { ServerModule } from './server/server.module';
import { TemplateModule } from './template/template.module';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';
import { ChangelogModule } from './changelog/changelog.module';
import { ConfigModule } from './config/config.module';
import { OauthModule } from './oauth/oauth.module';

@Module({
  imports: [
    ServerModule,
    TemplateModule,
    ProjectModule,
    UserModule,
    ChangelogModule,
    ConfigModule,
    OauthModule,
  ],
})
export class SystemModule {}
