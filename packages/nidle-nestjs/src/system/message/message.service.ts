import { Injectable, MessageEvent as CommonMessageEvent } from '@nestjs/common';
import { Observable, Subscriber } from 'rxjs';
import { MessageEvent } from './message.interface';

@Injectable()
export class MessageService {
  private sseSubscriber = null;

  send(message: MessageEvent) {
    this.sendSse(message);
  }

  createSse() {
    return new Observable((subscriber: Subscriber<CommonMessageEvent>) => {
      this.sseSubscriber = subscriber;
    });
  }

  sendSse(message: MessageEvent) {
    if (this.sseSubscriber) {
      this.sseSubscriber.next({
        data: message,
      });
    }
  }
}
