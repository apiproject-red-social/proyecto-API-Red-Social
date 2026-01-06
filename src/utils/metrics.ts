import client from 'prom-client';

// Habilitar la recolección de métricas por defecto (CPU, Memoria, Event Loop)
client.collectDefaultMetrics({ prefix: 'boilerplate_' });

// Métrica personalizada para medir latencia y volumen de peticiones
export const restResponseTimeHistogram = new client.Histogram({
  name: 'rest_response_time_duration_seconds',
  help: 'REST API response time in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5], // Buckets lógicos para una API REST
});

export { client };
