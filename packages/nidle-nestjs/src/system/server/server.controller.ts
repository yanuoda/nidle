import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { formatPageParams } from 'src/utils';

import {
  CreateServerDTO,
  QeuryServerListDTO,
  RemoveServerDTO,
  UpdateServerDTO,
} from './server.dto';
import { ServerService } from './server.service';

@ApiTags('服务器相关接口')
@Controller('server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @ApiOperation({ summary: '查询服务器列表' })
  @Post('list')
  async getServerList(@Body() queryParam: QeuryServerListDTO) {
    const { current, pageSize: _pageSize } = queryParam;
    const { page, pageSize } = formatPageParams(current, _pageSize);
    const { list, total } = await this.serverService.getServerList({
      ...queryParam,
      current: page,
      pageSize,
    });
    return { data: list, total, success: true };
  }

  @ApiOperation({ summary: '查询服务器' })
  @Get('query')
  async getServer(@Query('id') id: number) {
    return await this.serverService.getServer(id);
  }

  @ApiOperation({ summary: '添加服务器' })
  @Post('add')
  async addServer(@Body() param: CreateServerDTO) {
    await this.serverService.createServer(param);
    return { success: true };
  }

  @ApiOperation({ summary: '编辑服务器' })
  @Post('modify')
  async modifyServer(@Body() param: UpdateServerDTO) {
    await this.serverService.updateServer(param);
    return { success: true };
  }

  @ApiOperation({ summary: '删除服务器' })
  @Post('delete')
  async deleteServer(@Body() { id }: RemoveServerDTO) {
    await this.serverService.deleteServer(id);
    return { success: true };
  }
}
