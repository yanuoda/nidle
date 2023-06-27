import { Controller, Get } from '@nestjs/common';
import { ServerService } from './server.service';

@Controller('server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Get()
  getHellp(): string {
    return this.serverService.getHello();
  }
}
