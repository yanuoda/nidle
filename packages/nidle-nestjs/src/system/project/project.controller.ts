import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { formatPageParams } from 'src/utils';
import { FormatResponse } from 'src/common/base.dto';
import { ProjectService } from './project.service';
import {
  CreateOrUpdateProjectDto,
  CreateOrUpdateProjectResponseDto,
  QueryProjectDto,
  QueryProjectListDto,
  QueryProjectListResponseDto,
  QueryProjectResponseDto,
  RemoveProjectDto,
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
    @Query() { id }: QueryProjectDto,
  ): Promise<QueryProjectResponseDto> {
    const data = await this.projectService.findOne(id);
    return { data };
  }

  @ApiOperation({ summary: '删除项目（物理）' })
  @Post('delete')
  async remove(@Body() { id }: RemoveProjectDto): Promise<FormatResponse> {
    await this.projectService.remove(id);
    return {};
  }
}
