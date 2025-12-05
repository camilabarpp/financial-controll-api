import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongodb';

@Catch()  
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno do servidor';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      message = typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || message;
    }
    else if (exception instanceof MongoError) {
      if (exception.code === 11000) {
        status = HttpStatus.CONFLICT;
        const keyValue = (exception as any).keyValue;
        const field = Object.keys(keyValue || {})[0];
       
        if (field === 'name' || (exception as any).keyPattern?.name) {
          message = `Já existe uma economia com o nome "${keyValue.name}". Por favor, escolha outro nome.`;
        } else {
          message = `Registro duplicado. O valor já existe no sistema.`;
        }
      } else {
        message = 'Erro ao processar operação no banco de dados';
      }
    }
    // Erro genérico (qualquer outro tipo de erro)
    else if (exception instanceof Error) {
      message = exception.message;
    }

    // Log do erro para debug
    console.error('Exception caught:', {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: exception,
    });

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}