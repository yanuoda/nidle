import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param } from '@nestjs/common';

import { formatPageParams } from 'src/utils';
import { IdQueryRequestDto, IdResponseDto } from 'src/common/base.dto';
import { AirlineService } from './airline_publish.service';
import {
  CreateAirlinePublishDto,
  QeuryAirlinePublishListDTO,
  QueryAirlinePublishListResponseDTO,
  UpdateAirlinePublishDto,
} from './airline_publish.dto';

@ApiTags('航司-服务器发布配置相关接口')
@Controller('airline-publish')
export class AirlineController {
  constructor(private readonly airlineService: AirlineService) {}

  @Post('add')
  async create(
    @Body() createAirlineDto: CreateAirlinePublishDto,
  ): Promise<IdResponseDto> {
    const { id } = await this.airlineService.create(createAirlineDto);
    return { id };
  }

  @ApiOperation({ summary: '查询列表' })
  @Post('list')
  async findAllByPage(
    @Body() queryParam: QeuryAirlinePublishListDTO,
  ): Promise<QueryAirlinePublishListResponseDTO> {
    const { current, pageSize: _pageSize } = queryParam;
    const { page, pageSize } = formatPageParams(current, _pageSize);
    const { list, total } = await this.airlineService.findAllByPage({
      ...queryParam,
      current: page,
      pageSize,
    });
    return { data: list, total };
  }

  @Get(':id')
  async findOne(@Param() { id: _id }: IdQueryRequestDto) {
    const data = await this.airlineService.findOne(+_id);
    return { data };
  }

  @Post('modify')
  async update(@Body() updateAirlineDto: UpdateAirlinePublishDto) {
    const { id } = await this.airlineService.update(updateAirlineDto);
    return { id };
  }

  @Post('delete')
  async remove(@Body() { id: _id }: IdQueryRequestDto) {
    const { affected } = await this.airlineService.remove(+_id);
    return { affected };
  }
}
