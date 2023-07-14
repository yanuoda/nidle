import { Controller, Post, Body, Session } from '@nestjs/common';

import { IdBodyRequestDto, SessionDto } from 'src/common/base.dto';
import { ChangelogService } from './changelog.service';
import {
  CreateChangelogDto,
  GetLogDto,
  MergeHookDto,
  StartChangelogDto,
} from './changelog.dto';

@Controller('changelog')
export class ChangelogController {
  constructor(private readonly changelogService: ChangelogService) {}

  @Post('create')
  async create(
    @Body() createChangelogDto: CreateChangelogDto,
    @Session() session: SessionDto,
  ) {
    const data = await this.changelogService.create(
      createChangelogDto,
      session.user,
    );
    return { data };
  }

  @Post('start')
  async start(@Body() body: StartChangelogDto, @Session() session: SessionDto) {
    const { project, environment } = await this.changelogService.findOneBy(
      body.id,
    );
    await this.changelogService.checkAndGetProjectInfo(project, session.user);
    const data = await this.changelogService.start(body, environment);
    return { data };
  }

  @Post('quit')
  async quit(@Body() { id }: IdBodyRequestDto, @Session() session: SessionDto) {
    const { project, configPath } = await this.changelogService.findOneBy(id);
    await this.changelogService.checkAndGetProjectInfo(project, session.user);
    const data = await this.changelogService.quit(id, configPath);
    return { data };
  }

  @Post('detail')
  async detail(@Body() { id }: IdBodyRequestDto) {
    const data = this.changelogService.detail(id);
    return { data };
  }

  @Post('log')
  async log(@Body() body: GetLogDto) {
    const data = this.changelogService.log(body);
    return { data };
  }

  @Post('mergeHook')
  async mergeHook(@Body() body: MergeHookDto, @Session() session: SessionDto) {
    const data = this.changelogService.mergeHook(body, session.user);
    return { data };
  }
}
