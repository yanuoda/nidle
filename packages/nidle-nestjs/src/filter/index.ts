import { Response } from 'express';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  HttpExceptionBody,
} from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message || '服务器出错了';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionRes = exception.getResponse();
      message =
        typeof exceptionRes === 'string'
          ? exceptionRes
          : String((exceptionRes as HttpExceptionBody).message);
    }

    response.status(statusCode).json({
      statusCode,
      message,
      success: false,
    });
  }
}
