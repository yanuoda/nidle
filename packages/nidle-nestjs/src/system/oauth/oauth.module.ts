import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';

@Module({
  controllers: [OauthController],
  providers: [OauthService],
  imports: [UserModule],
})
export class OauthModule {}
