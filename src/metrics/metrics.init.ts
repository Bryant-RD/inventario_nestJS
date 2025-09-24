import { collectDefaultMetrics, register, Histogram, Counter } from 'prom-client';

// Métricas del sistema y Node.js
collectDefaultMetrics({
  prefix: 'nodejs_',
});

// Histograma para duración de requests HTTP
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duración de las solicitudes HTTP',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});

// Contador de requests totales
export const httpRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Número total de requests HTTP',
  labelNames: ['method', 'route', 'status_code'],
});

// Exportar registro global
export { register };
