import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((res) => {
        let obj = res;
        if (Object.prototype.toString.call(res) !== '[object Object]') {
          obj = { data: res };
        }
        return { success: true, ...obj };
      }),
    );
  }
}
