import { Injectable, MessageEvent } from '@nestjs/common';
import { Observable, Subscriber } from 'rxjs';
import { remove } from 'lodash';

import { MessageData } from './message.interface';

@Injectable()
export class MessageService {
  private sseSubscribers: Subscriber<MessageEvent>[] = [];

  send(message: MessageData) {
    this.sendSse({ ...message, timestamp: message.timestamp || Date.now() });
  }

  createSse() {
    return new Observable((subscriber: Subscriber<MessageEvent>) => {
      remove(this.sseSubscribers, (subscriber) => subscriber.closed);
      this.sseSubscribers.push(subscriber);
    });
  }

  sendSse(message: MessageData) {
    remove(this.sseSubscribers, (subscriber) => subscriber.closed);
    this.sseSubscribers.forEach((subscriber) => {
      subscriber.next({
        data: message,
      });
    });
  }
}
