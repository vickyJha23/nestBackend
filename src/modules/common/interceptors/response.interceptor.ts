import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { stat } from "fs";
import { Observable } from "rxjs";
import {map} from "rxjs/operators"



@Injectable()
export class ResponseInterceptor <T> implements NestInterceptor <T, any> {
     intercept(content: ExecutionContext, next: CallHandler):Observable <any> {

        return next.handle().pipe(map((data) => {
             return {
                  success: true,
                  message: data?.message || "Request successfull",
                  data 
             }
        }))
     
      } 

}