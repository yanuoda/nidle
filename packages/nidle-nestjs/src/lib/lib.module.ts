import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { GitlabService } from './gitlab.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [GitlabService],
  exports: [GitlabService],
})
export class LibModule {}
