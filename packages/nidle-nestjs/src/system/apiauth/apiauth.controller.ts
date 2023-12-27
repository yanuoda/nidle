import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { formatPageParams } from 'src/utils';
import { IdQueryRequestDto, IdResponseDto } from 'src/common/base.dto';
import { ApiauthService } from './apiauth.service';
import {
  CreateApiauthDto,
  QeuryApiauthListDTO,
  QueryApiauthListResponseDTO,
  UpdateApiauthDto,
} from './apiauth.dto';

@ApiTags('接口调用权限相关接口')
@Controller('apiauth')
export class ApiauthController {
  constructor(private readonly apiauthService: ApiauthService) {}

  @Post('add')
  async create(
    @Body() { name, status, description }: CreateApiauthDto,
  ): Promise<IdResponseDto> {
    const { id } = await this.apiauthService.create({
      name,
      status,
      description,
    });
    return { id };
  }

  @ApiOperation({ summary: '查询列表' })
  @Post('list')
  async findAllByPage(
    @Body() { current, pageSize: _pageSize, name }: QeuryApiauthListDTO,
  ): Promise<QueryApiauthListResponseDTO> {
    const { page, pageSize } = formatPageParams(current, _pageSize);
    const { list, total } = await this.apiauthService.findAllByPage({
      name,
      current: page,
      pageSize,
    });
    return { data: list, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.apiauthService.findOne(+id);
    return { data };
  }

  @Post('modify')
  async update(
    @Body() { id: _id, name, status, description }: UpdateApiauthDto,
  ) {
    const { id } = await this.apiauthService.update({
      id: _id,
      name,
      status,
      description,
    });
    return { id };
  }

  @Post('delete')
  async remove(@Body() { id }: IdQueryRequestDto) {
    const { affected } = await this.apiauthService.remove(+id);
    return { affected };
  }
}
