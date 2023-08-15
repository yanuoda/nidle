import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { formatPageParams } from 'src/utils';
import {
  IdQueryRequestDto,
  IdBodyRequestDto,
  IdResponseDto,
  AffectedResponseDto,
} from 'src/common/base.dto';
import { ServerService } from './server.service';
import {
  CreateServerDTO,
  GetAllServersResponseDTO,
  QeuryServerListDTO,
  QueryServerResponseDTO,
  QueryServerListResponseDTO,
  UpdateServerDTO,
  GetAllServersDTO,
} from './server.dto';

@ApiTags('服务器相关接口')
@Controller('server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @ApiOperation({ summary: '添加服务器' })
  @Post('add')
  async addServer(@Body() param: CreateServerDTO): Promise<IdResponseDto> {
    const { id } = await this.serverService.create(param);
    return { id };
  }

  @ApiOperation({ summary: '查询所有服务器（下拉框）' })
  @Post()
  async getAllServers(
    @Body() body: GetAllServersDTO,
  ): Promise<GetAllServersResponseDTO> {
    const data = await this.serverService.findAll(body);
    return { data };
  }

  @ApiOperation({ summary: '查询服务器列表' })
  @Post('list')
  async queryServerList(
    @Body() queryParam: QeuryServerListDTO,
  ): Promise<QueryServerListResponseDTO> {
    const { current, pageSize: _pageSize } = queryParam;
    const { page, pageSize } = formatPageParams(current, _pageSize);
    const { list, total } = await this.serverService.findAllByPage({
      ...queryParam,
      current: page,
      pageSize,
    });
    return { data: list, total };
  }

  @ApiOperation({ summary: '查询服务器' })
  @Get('query')
  async getServer(
    @Query() { id }: IdQueryRequestDto,
  ): Promise<QueryServerResponseDTO> {
    const dataValues = await this.serverService.findOne(id);
    // 兼容原接口数据格式
    return { data: { dataValues } };
  }

  @ApiOperation({ summary: '编辑服务器' })
  @Post('modify')
  async modifyServer(@Body() param: UpdateServerDTO): Promise<IdResponseDto> {
    const { id } = await this.serverService.update(param);
    return { id };
  }

  @ApiOperation({ summary: '删除服务器' })
  @Post('delete')
  async deleteServer(
    @Body() { id }: IdBodyRequestDto,
  ): Promise<AffectedResponseDto> {
    const { affected } = await this.serverService.remove(id);
    return { affected };
  }
}
