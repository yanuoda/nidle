import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ConfigService } from './config.service';
import { AppConfigParam, AppPublishConfigParam } from './config.dto';

@ApiTags('配置相关')
@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @ApiOperation({ summary: 'getByApp' })
  @Post('getByApp')
  async getByApp(@Body() body: AppConfigParam) {
    const data = await this.configService.getAppConfig(body);
    return { data };
  }

  @ApiOperation({ summary: 'getByCreate' })
  @Post('getByCreate')
  async getByCreate(@Body() body: AppPublishConfigParam) {
    const data = await this.configService.getAppPublishConfig(body);
    return { data };
  }

  @ApiOperation({ summary: 'getInput' })
  @Post('getInput')
  async getInput(@Body() body: Record<string, any>) {
    const { inputs, values, source } = body;
    const data = this.configService.getInput(inputs, values, source);
    return { data };
  }

  @ApiOperation({ summary: 'setInput' })
  @Post('setInput')
  async setInput(@Body() body: Record<string, any>) {
    const { values, groups, notTransform } = body;
    const data = this.configService.setInput(values, groups, notTransform);
    return { data };
  }
}
