import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource, RawResourceAttribute } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const traceExporter = new OTLPTraceExporter();

const sdk = new NodeSDK({
  resource: {
      attributes: {
          [SemanticResourceAttributes.SERVICE_NAME]: 'inventory-system-backend',
          [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
      },
      merge: function (other: Resource | null): Resource {
          throw new Error('Function not implemented.');
      },
      getRawAttributes: function (): RawResourceAttribute[] {
          throw new Error('Function not implemented.');
      }
  },
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

// Inicia el SDK
try {
  sdk.start();
  console.log('✅ OpenTelemetry tracing started successfully.');
} catch (err) {
  console.error('❌ Error starting OpenTelemetry tracing', err);
}

// Apagado limpio
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated.'))
    .catch((error) => console.error('Error terminating tracing', error))
    .finally(() => process.exit(0));
});

process.on('SIGINT', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated.'))
    .catch((error) => console.error('Error terminating tracing', error))
    .finally(() => process.exit(0));
});