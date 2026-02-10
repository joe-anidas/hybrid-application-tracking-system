/**
 * OpenTelemetry Instrumentation Setup
 * This file should be imported FIRST in your application entry point
 */

import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-proto";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import grafanaConfig from "./grafana.js";

let sdk;

/**
 * Initialize OpenTelemetry SDK
 */
export function initializeOpenTelemetry() {
  if (!grafanaConfig.opentelemetry.enabled) {
    console.log("OpenTelemetry is disabled");
    return null;
  }

  try {
    // Create resource attributes
    const resourceAttrs = {
      [ATTR_SERVICE_NAME]: grafanaConfig.opentelemetry.serviceName,
      [ATTR_SERVICE_VERSION]: grafanaConfig.opentelemetry.serviceVersion,
      "deployment.environment": process.env.NODE_ENV || "development",
    };

    // Configure trace exporter
    const traceExporter = new OTLPTraceExporter({
      url: grafanaConfig.opentelemetry.traces.endpoint,
      headers: grafanaConfig.opentelemetry.traces.headers,
    });

    // Configure metrics exporter
    const metricExporter = new OTLPMetricExporter({
      url: grafanaConfig.opentelemetry.metrics.endpoint,
      headers: grafanaConfig.opentelemetry.metrics.headers,
    });

    // Create metric reader
    const metricReader = new PeriodicExportingMetricReader({
      exporter: metricExporter,
      exportIntervalMillis: 60000, // Export every 60 seconds
    });

    // Initialize SDK with resource attributes
    sdk = new NodeSDK({
      resourceAttributes: resourceAttrs,
      traceExporter,
      metricReader,
      instrumentations: [
        getNodeAutoInstrumentations({
          // Customize auto-instrumentation
          "@opentelemetry/instrumentation-fs": {
            enabled: false, // Disable file system instrumentation (noisy)
          },
          "@opentelemetry/instrumentation-http": {
            enabled: true,
            ignoreIncomingPaths: ["/health", "/metrics"], // Ignore health checks
          },
          "@opentelemetry/instrumentation-express": {
            enabled: true,
          },
          "@opentelemetry/instrumentation-mongodb": {
            enabled: true,
          },
        }),
      ],
    });

    // Start the SDK
    sdk.start();
    console.log("OpenTelemetry initialized successfully");

    // Graceful shutdown
    process.on("SIGTERM", () => {
      sdk
        .shutdown()
        .then(() => console.log("OpenTelemetry shut down successfully"))
        .catch((error) =>
          console.error("Error shutting down OpenTelemetry", error),
        )
        .finally(() => process.exit(0));
    });

    return sdk;
  } catch (error) {
    console.error("Failed to initialize OpenTelemetry:", error);
    return null;
  }
}

export default sdk;
