import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './modules/common/interceptors/response.interceptor';
import { AllExceptionFilter } from './modules/common/filters/error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

 app.enableCors({
  origin: 'http://localhost:3000', 
  credentials: true,             
});
 app.useGlobalInterceptors(
  new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
       transform: true,
  }));
  await app.listen(process.env.PORT!);
}
bootstrap();
