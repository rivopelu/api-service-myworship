import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DefaultPostInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.method === 'POST') {
      return next.handle().pipe(
        map((data) => {
          context.switchToHttp().getResponse().statusCode = HttpStatus.OK;
          return data;
        }),
      );
    }

    return next.handle();
  }
}
