import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { OpenService } from './open.service';
import { AirlineConfigPublishDto } from './open.dto';
@ApiTags('开放接口')
@Controller('open')
export class OpenController {
  constructor(private readonly openService: OpenService) {}

  @ApiOperation({ summary: '发布航司配置文件' })
  @Post('airline-config/publish')
  async publishAirlineConfig(
    @Body()
    {
      apiKey,
      airline,
      environment,
      fileData,
      fileName,
    }: AirlineConfigPublishDto,
  ) {
    const data = await this.openService.publishAirlineConfig({
      apiKey,
      airline,
      environment,
      fileData,
      fileName,
    });
    return { data };
  }
}
