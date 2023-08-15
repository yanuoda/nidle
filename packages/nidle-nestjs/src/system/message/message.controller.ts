import { Controller, MessageEvent, Sse } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MessageService } from './message.service';

@ApiTags('消息相关接口')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({ summary: '服务器事件推送' })
  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return this.messageService.createSse();
  }
}
