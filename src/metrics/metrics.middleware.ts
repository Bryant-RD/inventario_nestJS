// src/metrics/metrics.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { httpRequestDuration, httpRequestCounter } from './metrics.init';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const end = httpRequestDuration.startTimer({ method: req.method, route: req.path });
    res.on('finish', () => {
      end({ status_code: res.statusCode });
      httpRequestCounter.inc({ method: req.method, route: req.path, status_code: res.statusCode });
    });
    next();
  }
}
