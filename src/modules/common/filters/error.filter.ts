import { ArgumentsHost, Catch, ExceptionFilter, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import {Response} from "express";


@Catch()
export class AllExceptionFilter implements ExceptionFilter {
     catch(exception:  unknown, host: ArgumentsHost) {
             const ctx = host.switchToHttp(); 
             const response = ctx.getResponse<Response>();
             
             let status = HttpStatus.INTERNAL_SERVER_ERROR;
             let message = 'Internal Server Error';
             let error = 'InternalServerErrorException';


             if(exception instanceof HttpException) {
                  status = exception.getStatus();
                  const res: any = exception.getResponse();
                  message = res?.message || exception.message;
                  error = exception.name;
             }
             else if (exception instanceof Error) {
                   message = exception.message;
                   error =  exception.name;
             }

             response.status(status).json({
                  success: false,
                  message,
                  error,
                  statusCode: status,
             })
             
       } 
}