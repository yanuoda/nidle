import { Body, Controller, Post } from '@nestjs/common';

import { ConfigService } from './config.service';
import { AppPublishConfigParam, CommonParams } from './config.dto';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Post('getByApp')
  async getByApp(@Body() body: CommonParams) {
    const data = await this.configService.getAppConfig(body);
    return { data };
  }

  @Post('getByCreate')
  async getByCreate(@Body() body: AppPublishConfigParam) {
    const data = await this.configService.getAppPublishConfig(body);
    return { data };
  }

  @Post('getInput')
  async getInput(@Body() body: Record<string, any>) {
    const { inputs, values, source } = body;
    const data = this.configService.getInput(inputs, values, source);
    return { data };
  }

  @Post('setInput')
  async setInput(@Body() body: Record<string, any>) {
    const { values, groups, notTransform } = body;
    const data = this.configService.setInput(values, groups, notTransform);
    return { data };
  }
}
