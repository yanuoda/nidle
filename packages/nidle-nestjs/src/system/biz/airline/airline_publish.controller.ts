import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param } from '@nestjs/common';

import { formatPageParams } from 'src/utils';
import { IdQueryRequestDto, IdResponseDto } from 'src/common/base.dto';
import { AirlinePublishService } from './airline_publish.service';
import {
  CreateAirlinePublishDto,
  QeuryAirlinePublishListDTO,
  QueryAirlinePublishListResponseDTO,
  UpdateAirlinePublishDto,
} from './airline_publish.dto';

@ApiTags('航司-服务器发布配置相关接口')
@Controller('airline-publish')
export class AirlinePublishController {
  constructor(private readonly airlineService: AirlinePublishService) {}

  @Post('add')
  async create(
    @Body()
    {
      airline,
      environment,
      projectServer,
      relativePath,
      status,
      description,
    }: CreateAirlinePublishDto,
  ): Promise<IdResponseDto> {
    const { id } = await this.airlineService.create({
      airline,
      environment,
      projectServer,
      relativePath,
      status,
      description,
    });
    return { id };
  }

  @ApiOperation({ summary: '查询列表' })
  @Post('list')
  async findAllByPage(
    @Body()
    {
      current,
      pageSize: _pageSize,
      airline,
      environment,
    }: QeuryAirlinePublishListDTO,
  ): Promise<QueryAirlinePublishListResponseDTO> {
    const { page, pageSize } = formatPageParams(current, _pageSize);
    const { list, total } = await this.airlineService.findAllByPage({
      airline,
      environment,
      current: page,
      pageSize,
    });
    return { data: list, total };
  }

  @Get(':id')
  async findOne(@Param() { id }: IdQueryRequestDto) {
    const data = await this.airlineService.findOne(+id);
    return { data };
  }

  @Post('modify')
  async update(
    @Body()
    {
      id: _id,
      airline,
      environment,
      projectServer,
      relativePath,
      status,
      description,
    }: UpdateAirlinePublishDto,
  ) {
    const { id } = await this.airlineService.update({
      id: _id,
      airline,
      environment,
      projectServer,
      relativePath,
      status,
      description,
    });
    return { id };
  }

  @Post('delete')
  async remove(@Body() { id }: IdQueryRequestDto) {
    const { affected } = await this.airlineService.remove(+id);
    return { affected };
  }
}
