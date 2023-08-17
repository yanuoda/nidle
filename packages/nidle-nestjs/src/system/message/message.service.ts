import { Injectable, MessageEvent as CommonMessageEvent } from '@nestjs/common';
import { Observable, Subscriber } from 'rxjs';
import { MessageEvent } from './message.interface';
import * as EventEmitter from 'events';

@Injectable()
export class MessageService {
  private readonly emitter = new EventEmitter();

  send(message: MessageEvent) {
    this.sendSse(message);
  }

  createSse() {
    return new Observable((subscriber: Subscriber<CommonMessageEvent>) => {
      this.emitter.on('send', (data: any) => {
        subscriber.next({ data });
      });
    });
  }

  sendSse(message: MessageEvent) {
    this.emitter.emit('send', message);
  }
}
