import {
  Inject,
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { SessionDto } from 'src/common/base.dto';
import { GitlabService } from 'src/lib/gitlab.service';

@Injectable()
export class GitlabOauthGuard implements CanActivate {
  constructor(
    private readonly gitlabService: GitlabService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const session = request.session as SessionDto;
    if (session?.user?.gitlabOauth) {
      const { created_at, expires_in, refresh_token } =
        session.user.gitlabOauth;

      // 表示已过期
      if (
        typeof expires_in === 'number' &&
        (created_at + expires_in) * 1000 < Date.now()
      ) {
        const gitlabOauth = await this.gitlabService
          .refreshOauthToken(refresh_token)
          .catch((e) => {
            const errMsg = `gitlab refreshOauthToken err:${e?.message}`;
            this.logger.error(errMsg, {
              error: JSON.stringify(e, Object.getOwnPropertyNames(e), 2),
              user: session.user,
            });
          });

        if (gitlabOauth) {
          session.user.gitlabOauth = gitlabOauth;
        } else {
          delete session.user.gitlabOauth;
        }
      }
    }

    return true;
  }
}
