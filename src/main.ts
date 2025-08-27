import './tracing'; // ¡Importante! Debe ser la primera importación para instrumentar todo.

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para permitir peticiones desde el frontend
  app.enableCors();

  // Usar ValidationPipe globalmente para validar todos los DTOs de entrada
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  await app.listen(process.env.PORT || 4000);
}
bootstrap();