import { Controller, Post, Body, Session } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { IdBodyRequestDto, SessionDto } from 'src/common/base.dto';
import { ChangelogService } from './changelog.service';
import {
  CreateChangelogDto,
  GetLogDto,
  MergeHookDto,
  StartChangelogDto,
  UpdateOneDto,
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
    const { projectId, type, mode, id } = createChangelogDto;
    const projectData = await this.changelogService.checkAndGetProjectInfo(
      projectId,
      session.user,
    );
    const changelog = await this.changelogService.checkChangelogNext(
      type,
      mode,
      id,
    );
    const data = await this.changelogService.create(
      createChangelogDto,
      { ...projectData, changelog },
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
    const data = await this.changelogService.detail(id);
    return { data };
  }

  @ApiOperation({ summary: '获取发布日志' })
  @Post('log')
  async log(@Body() body: GetLogDto) {
    const data = await this.changelogService.log(body);
    return { data };
  }

  @ApiOperation({ summary: 'mergeHook' })
  @Post('mergeHook')
  async mergeHook(@Body() body: MergeHookDto) {
    const data = await this.changelogService.mergeHook(body);
    return { data };
  }

  @ApiOperation({ summary: 'find one' })
  @Post('findone')
  async findone(@Body() { id }: IdBodyRequestDto) {
    const data = await this.changelogService.findOneBy(id);
    return { data };
  }

  @ApiOperation({ summary: 'update one' })
  @Post('updateone')
  async updateone(@Body() { id, ...obj }: UpdateOneDto) {
    const data = await this.changelogService.updateOne(id, obj);
    return { data };
  }

  @ApiOperation({ summary: 'delete one' })
  @Post('deleteone')
  async deleteone(@Body() { id }: IdBodyRequestDto) {
    const { affected } = await this.changelogService.deleteOne(id);
    return { affected };
  }
}
