import { Response } from 'express';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  HttpExceptionBody,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

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

    this.logger.error(message, {
      statusCode,
      stack: exception.stack,
    });

    response.status(statusCode).json({
      statusCode,
      errorMessage: message,
      success: false,
      /** @check */
      showType: 2,
    });
  }
}
