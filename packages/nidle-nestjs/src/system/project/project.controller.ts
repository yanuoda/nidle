import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { formatPageParams } from 'src/utils';
import {
  IdQueryRequestDto,
  IdBodyRequestDto,
  FormatResponse,
  IdResponseDto,
} from 'src/common/base.dto';
import { ProjectService } from './project.service';
import {
  CreateOrUpdateProjectDto,
  CreateProjectServerDto,
  CreateProjectServerResponseDto,
  FetchProjectServerDto,
  FetchProjectServerResponseDto,
  PublishListResponseDto,
  QueryProjectListDto,
  QueryProjectListResponseDto,
  QueryProjectResponseDto,
  UpdateContactsDto,
  UpdateProjectServerDto,
} from './project.dto';

@ApiTags('项目相关接口')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({ summary: '添加/编辑项目' })
  @Post('sync')
  async create(
    @Body() param: CreateOrUpdateProjectDto,
  ): Promise<IdResponseDto> {
    const { id: _id, ...restParam } = param;
    const { id } = _id
      ? await this.projectService.update(param)
      : await this.projectService.create(restParam);
    return { id };
  }

  @ApiOperation({ summary: '查询项目列表' })
  @Post('list')
  async findAll(
    @Body() queryParam: QueryProjectListDto,
  ): Promise<QueryProjectListResponseDto> {
    const { current, pageSize: _pageSize } = queryParam;
    const { page, pageSize } = formatPageParams(current, _pageSize);
    const { list, total } = await this.projectService.findAll({
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
  async remove(@Body() { id }: IdBodyRequestDto): Promise<FormatResponse> {
    await this.projectService.remove(id);
    return {};
  }

  @ApiOperation({ summary: '查询项目分支（size=100）' })
  @Get('branches')
  async branches(
    @Query() { id }: IdQueryRequestDto,
  ): Promise<Record<string, any>> {
    const data = await this.projectService.getBranches(id);
    return { data };
  }

  @ApiOperation({ summary: '更新通知邮箱' })
  @Post('contacts/update')
  async updateContacts(
    @Body() { id, postEmails }: UpdateContactsDto,
  ): Promise<FormatResponse> {
    await this.projectService.updateContacts(id, postEmails);
    return {};
  }

  /** projectServer ↓ */

  @ApiOperation({ summary: '添加项目服务器配置' })
  @Post('server/add')
  async addProjectServer(
    @Body() param: CreateProjectServerDto,
  ): Promise<CreateProjectServerResponseDto> {
    const data = await this.projectService.createProjectServer(param);
    return { data };
  }

  @ApiOperation({ summary: '编辑项目服务器配置' })
  @Post('server/modify')
  async modifyProjectServer(
    @Body() param: UpdateProjectServerDto,
  ): Promise<IdResponseDto> {
    const { id } = await this.projectService.updateProjectServer(param);
    return { id };
  }

  @ApiOperation({ summary: '删除项目服务器配置（物理）' })
  @Post('server/delete')
  async deleteProjectServer(
    @Body() { id }: IdBodyRequestDto,
  ): Promise<FormatResponse> {
    await this.projectService.removeProjectServer(id);
    return {};
  }

  @ApiOperation({ summary: '获取项目服务器配置' })
  @Post('server/fetch')
  async fetchProjectServer(
    @Body() { id, mode }: FetchProjectServerDto,
  ): Promise<FetchProjectServerResponseDto> {
    const data = await this.projectService.fetchProjectServer(id, mode);
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
}
