import { Controller, Post, Body, Session } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { IdBodyRequestDto, SessionDto } from 'src/common/base.dto';
import { getSessionUser } from 'src/utils';
import { ChangelogService } from './changelog.service';
import {
  CreateChangelogDto,
  DeleteByIdsDto,
  GetLogDto,
  MergeHookDto,
  CallQueueAndJobMethodDto,
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
    const sessionUser = getSessionUser(session);
    const { projectId, type, mode, id } = createChangelogDto;
    const projectData = await this.changelogService.checkAndGetProjectInfo(
      projectId,
      sessionUser,
    );
    const changelog = await this.changelogService.checkChangelogNext(
      type,
      mode,
      id,
    );
    const data = await this.changelogService.create(
      createChangelogDto,
      { ...projectData, changelog },
      sessionUser,
    );
    return { data };
  }

  @ApiOperation({ summary: '启动发布' })
  @Post('start')
  async start(@Body() body: StartChangelogDto, @Session() session: SessionDto) {
    const sessionUser = getSessionUser(session);
    const { project, environment, description } =
      await this.changelogService.findOneBy(body.id);
    const { projectName } = await this.changelogService.checkAndGetProjectInfo(
      project,
      sessionUser,
    );
    const data = await this.changelogService.start(body, {
      environment,
      changelogDesc: description,
      projectId: project,
      projectName,
    });
    return { data };
  }

  @ApiOperation({ summary: '基于当前发布创建并运行发布任务' })
  @Post('republish')
  async republish(
    @Body() { id }: IdBodyRequestDto,
    @Session() session: SessionDto,
  ) {
    const sessionUser = getSessionUser(session);
    const changelog = await this.changelogService.findOneBy(id);
    const { repositoryType, repositoryUrl, projectName, gitlabId } =
      await this.changelogService.checkAndGetProjectInfo(
        changelog.project,
        sessionUser,
      );
    const data = this.changelogService.createAndStart(changelog, {
      repositoryType,
      repositoryUrl,
      name: projectName,
      gitlabId,
    });
    return { data };
  }

  @ApiOperation({ summary: '退出发布' })
  @Post('quit')
  async quit(@Body() { id }: IdBodyRequestDto, @Session() session: SessionDto) {
    const sessionUser = getSessionUser(session);
    const { project, configPath } = await this.changelogService.findOneBy(id);
    await this.changelogService.checkAndGetProjectInfo(project, sessionUser);
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

  @ApiOperation({ summary: 'delete by ids' })
  @Post('delete')
  async deleteByIds(@Body() { ids }: DeleteByIdsDto) {
    const affecteds = await this.changelogService.deleteByIds(ids);
    return { affecteds, idCount: ids.length };
  }

  @ApiOperation({ summary: 'call queue method' })
  @Post('callQueueMethod')
  async callQueueMethod(@Body() body: CallQueueAndJobMethodDto) {
    const data = await this.changelogService.callQueueMethodBy(body);
    return { data };
  }

  @ApiOperation({ summary: 'call job method' })
  @Post('callJobMethod')
  async callJobMethod(@Body() body: CallQueueAndJobMethodDto) {
    const data = await this.changelogService.callJobMethodBy(body);
    return { data };
  }
}
