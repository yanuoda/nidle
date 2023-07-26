import { Controller, Post, Body, Session } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { IdBodyRequestDto, SessionDto } from 'src/common/base.dto';
import { ChangelogService } from './changelog.service';
import {
  CreateChangelogDto,
  GetLogDto,
  MergeHookDto,
  StartChangelogDto,
} from './changelog.dto';

@ApiTags('发布相关接口')
@Controller('changelog')
export class ChangelogController {
  constructor(private readonly changelogService: ChangelogService) {}

  @ApiOperation({ summary: '创建发布' })
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

  @ApiOperation({ summary: '启动发布' })
  @Post('start')
  async start(@Body() body: StartChangelogDto, @Session() session: SessionDto) {
    const { project, environment } = await this.changelogService.findOneBy(
      body.id,
    );
    await this.changelogService.checkAndGetProjectInfo(project, session.user);
    const data = await this.changelogService.start(body, environment);
    return { data };
  }

  @ApiOperation({ summary: '退出发布' })
  @Post('quit')
  async quit(@Body() { id }: IdBodyRequestDto, @Session() session: SessionDto) {
    const { project, configPath } = await this.changelogService.findOneBy(id);
    await this.changelogService.checkAndGetProjectInfo(project, session.user);
    const data = await this.changelogService.quit(id, configPath);
    return { data };
  }

  @ApiOperation({ summary: '获取发布详情' })
  @Post('detail')
  async detail(@Body() { id }: IdBodyRequestDto) {
    const data = this.changelogService.detail(id);
    return { data };
  }

  @ApiOperation({ summary: '获取发布日志' })
  @Post('log')
  async log(@Body() body: GetLogDto) {
    const data = this.changelogService.log(body);
    return { data };
  }

  @ApiOperation({ summary: 'mergeHook' })
  @Post('mergeHook')
  async mergeHook(@Body() body: MergeHookDto, @Session() session: SessionDto) {
    const data = this.changelogService.mergeHook(body, session.user);
    return { data };
  }
}
