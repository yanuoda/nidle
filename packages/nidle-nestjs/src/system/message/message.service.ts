import { Injectable, MessageEvent as CommonMessageEvent } from '@nestjs/common';
import { Observable, Subscriber } from 'rxjs';
import { MessageEvent } from './message.interface';
import { remove } from 'lodash';
// import * as EventEmitter from 'events';

@Injectable()
export class MessageService {
  // private readonly emitter = new EventEmitter();
  private sseSubscribers = [];

  send(message: MessageEvent) {
    this.sendSse(message);
  }

  createSse() {
    return new Observable((subscriber: Subscriber<CommonMessageEvent>) => {
      // this.emitter.on('send', (data: any) => {
      //   subscriber.next({ data });
      // });
      remove(this.sseSubscribers, (subscriber) => subscriber.closed);
      this.sseSubscribers.push(subscriber);
    });
  }

  sendSse(message: MessageEvent) {
    // this.emitter.emit('send', message);
    remove(this.sseSubscribers, (subscriber) => subscriber.closed);
    this.sseSubscribers.forEach((subscriber) => {
      subscriber.next({
        data: message,
      });
    });
  }
}
