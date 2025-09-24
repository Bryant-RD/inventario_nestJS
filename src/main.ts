import './polyfills';
import './metrics/metrics.init';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

// 👇 Importamos las métricas
import { httpRequestDuration, httpRequestCounter } from './metrics/metrics.init';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para permitir peticiones desde el frontend
  app.enableCors();

  // Usar ValidationPipe globalmente para validar todos los DTOs de entrada
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  // 👇 Middleware para medir métricas de Prometheus
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const end = httpRequestDuration.startTimer();
    res.on('finish', () => {
      const route = (req.route && (req.route as any).path) || req.path || 'unknown';

      // Incrementar el contador de requests
      httpRequestCounter.inc({ method: req.method, route, status_code: res.statusCode });

      // Finalizar el histograma con labels
      end({ method: req.method, route, status_code: res.statusCode });
    });
    next();
  });

  await app.listen(process.env.PORT || 4000, '0.0.0.0');
}
bootstrap();
