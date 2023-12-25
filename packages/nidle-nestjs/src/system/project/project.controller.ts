import { Controller, Get, Post, Body, Query, Session } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { formatPageParams, getSessionUser } from 'src/utils';
import {
  IdQueryRequestDto,
  IdBodyRequestDto,
  AffectedResponseDto,
  SessionDto,
} from 'src/common/base.dto';
import { ProjectService } from './project.service';
import {
  CreateOrUpdateProjectDto,
  CreateOrUpdateProjectResponseDto,
  CreateProjectServerDto,
  CreateProjectServerResponseDto,
  FetchProjectBranchesDto,
  FetchProjectServerDto,
  FetchProjectServerResponseDto,
  InvokeWebhooksBodyDto,
  PublishListResponseDto,
  PublishListResponseDtoV2,
  QueryProjectListDto,
  QueryProjectListResponseDto,
  QueryProjectResponseDto,
  QueryPublishListDto,
  UpdateContactsDto,
  UpdateProjectServerDto,
  UpdateProjectServerResponseDto,
} from './project.dto';

@ApiTags('项目相关接口')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({ summary: '添加/编辑项目' })
  @Post('sync')
  async create(
    @Body() param: CreateOrUpdateProjectDto,
  ): Promise<CreateOrUpdateProjectResponseDto> {
    const { id: _id, repositoryUrl: originRepoUrl, ...restParam } = param;
    const repositoryUrl = originRepoUrl.replace('.git', '');
    const data = _id
      ? await this.projectService.update({ ...param, repositoryUrl })
      : await this.projectService.create({ ...restParam, repositoryUrl });
    return { data };
  }

  @ApiOperation({ summary: '查询项目列表' })
  @Post('list')
  async findAllByPage(
    @Body() queryParam: QueryProjectListDto,
  ): Promise<QueryProjectListResponseDto> {
    const { current, pageSize: _pageSize } = queryParam;
    const { page, pageSize } = formatPageParams(current, _pageSize);
    const { list, total } = await this.projectService.findAllByPage({
      ...queryParam,
      current: page,
      pageSize,
    });
    return { data: list, total };
  }

  @ApiOperation({ summary: '查询项目' })
  @Get('detail')
  async findOne(
    @Query() { id }: IdQueryRequestDto,
  ): Promise<QueryProjectResponseDto> {
    const data = await this.projectService.findProjectAndRelations(id);
    return { data };
  }

  @ApiOperation({ summary: '删除项目（物理）' })
  @Post('delete')
  async remove(@Body() { id }: IdBodyRequestDto): Promise<AffectedResponseDto> {
    const { affected } = await this.projectService.remove(id);
    return { affected };
  }

  @ApiOperation({ summary: '查询项目分支（size=50）' })
  @Get('branches')
  async branches(
    @Query() { id, search }: FetchProjectBranchesDto,
  ): Promise<Record<string, any>> {
    const data = await this.projectService.getBranches(id, search);
    return { data };
  }

  @ApiOperation({ summary: '更新通知邮箱' })
  @Post('contacts/update')
  async updateContacts(
    @Body() { id, postEmails }: UpdateContactsDto,
  ): Promise<AffectedResponseDto> {
    const { affected } = await this.projectService.updateContacts(
      id,
      postEmails,
    );
    return { affected };
  }

  /** projectServer ↓ */

  @ApiOperation({ summary: '添加项目服务器配置' })
  @Post('server/add')
  async addProjectServer(
    @Body()
    {
      environment,
      output,
      project,
      server,
      description,
    }: CreateProjectServerDto,
  ): Promise<CreateProjectServerResponseDto> {
    const data = await this.projectService.createProjectServer({
      environment,
      output,
      project,
      server,
      description,
    });
    return { data };
  }

  @ApiOperation({ summary: '编辑项目服务器配置' })
  @Post('server/modify')
  async modifyProjectServer(
    @Body()
    {
      id,
      environment,
      output,
      project,
      server,
      description,
    }: UpdateProjectServerDto,
  ): Promise<UpdateProjectServerResponseDto> {
    const data = await this.projectService.updateProjectServer({
      id,
      environment,
      output,
      project,
      server,
      description,
    });
    return { data };
  }

  @ApiOperation({ summary: '删除项目服务器配置（物理）' })
  @Post('server/delete')
  async deleteProjectServer(
    @Body() { id }: IdBodyRequestDto,
  ): Promise<AffectedResponseDto> {
    const { affected } = await this.projectService.removeProjectServer(id);
    return { affected };
  }

  @ApiOperation({ summary: '获取项目服务器配置' })
  @Post('server/fetch')
  async fetchProjectServer(
    @Body() { id, mode }: FetchProjectServerDto,
  ): Promise<FetchProjectServerResponseDto> {
    const data = await this.projectService.fetchProjectServerBy({
      project: { id },
      environment: mode,
    });
    return { data };
  }

  /** changelog ↓ */

  @ApiOperation({ summary: '获取项目发布列表' })
  @Get('publish/list')
  async getPublishList(
    @Query() { id }: IdQueryRequestDto,
  ): Promise<PublishListResponseDto> {
    const data = await this.projectService.getPublishList(id);
    return { data };
  }

  @ApiOperation({ summary: '获取项目发布列表V2' })
  @Post('publish/list')
  async getPublishListV2(
    @Body() body: QueryPublishListDto,
  ): Promise<PublishListResponseDtoV2> {
    const { current, pageSize: _pageSize } = body;
    const { page, pageSize } = formatPageParams(current, _pageSize);

    const { list, total } = await this.projectService.findPublishByPage({
      ...body,
      current: page,
      pageSize,
    });
    return { data: list, total };
  }

  @ApiOperation({ summary: '获取项目发布子记录列表' })
  @Post('publish/child-list')
  async getPublishChildren(
    @Body() body: QueryPublishListDto,
  ): Promise<PublishListResponseDtoV2> {
    const { current, pageSize: _pageSize } = body;
    const { page, pageSize } = formatPageParams(current, _pageSize);

    const { list, total } = await this.projectService.findPublishChildren({
      ...body,
      current: page,
      pageSize,
    });
    return { data: list, total };
  }

  @ApiOperation({ summary: '获取webhooks' })
  @Post('get-webhooks')
  async getWebhooks(@Body() { id }: IdBodyRequestDto) {
    const data = await this.projectService.getWebhooks(id);
    return { data };
  }

  @ApiOperation({ summary: '触发webhooks' })
  @Post('invoke-webhooks')
  async invokeWebhooks(
    @Body() { id, branch }: InvokeWebhooksBodyDto,
    @Session() session: SessionDto,
  ) {
    const sessionUser = getSessionUser(session);
    const data = await this.projectService.invokeWebhooks(
      id,
      branch,
      sessionUser,
    );
    return { data };
  }
}
