import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { formatPageParams } from 'src/utils';
import { FormatResponse } from 'src/common/base.dto';

import {
  CreateServerDTO,
  QeuryServerListDTO,
  RemoveServerDTO,
  ResServerDTO,
  ResServerListDTO,
  UpdateServerDTO,
} from './server.dto';
import { ServerService } from './server.service';

@ApiTags('服务器相关接口')
@Controller('server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @ApiOperation({ summary: '添加服务器' })
  @Post('add')
  async addServer(@Body() param: CreateServerDTO): Promise<FormatResponse> {
    await this.serverService.create(param);
    return {};
  }

  @ApiOperation({ summary: '查询服务器列表' })
  @Post('list')
  async getServerList(
    @Body() queryParam: QeuryServerListDTO,
  ): Promise<ResServerListDTO> {
    const { current, pageSize: _pageSize } = queryParam;
    const { page, pageSize } = formatPageParams(current, _pageSize);
    const { list, total } = await this.serverService.findAll({
      ...queryParam,
      current: page,
      pageSize,
    });
    return { data: list, total };
  }

  @ApiOperation({ summary: '查询服务器' })
  @Get('query')
  async getServer(@Query('id') id: number): Promise<ResServerDTO> {
    const dataValues = await this.serverService.findOne(id);
    // 兼容原接口数据格式
    return { data: { dataValues } };
  }

  @ApiOperation({ summary: '编辑服务器' })
  @Post('modify')
  async modifyServer(@Body() param: UpdateServerDTO): Promise<FormatResponse> {
    await this.serverService.update(param);
    return {};
  }

  @ApiOperation({ summary: '删除服务器' })
  @Post('delete')
  async deleteServer(@Body() { id }: RemoveServerDTO): Promise<FormatResponse> {
    await this.serverService.remove(id);
    return {};
  }
}
