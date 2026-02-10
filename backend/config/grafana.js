/**
 * Grafana Cloud Configuration
 * Centralized configuration for Loki, Prometheus, and OpenTelemetry
 */

export const grafanaConfig = {
  // Grafana Cloud Loki Configuration
  loki: {
    enabled: process.env.LOKI_ENABLED === "true",
    host: process.env.LOKI_HOST || "logs-prod-us-central1.grafana.net",
    basicAuth: {
      username: process.env.LOKI_USERNAME || "",
      password: process.env.LOKI_PASSWORD || "", // Use Grafana Cloud API key
    },
    labels: {
      app: "hybrid-ats",
      env: process.env.NODE_ENV || "development",
      service: "backend",
    },
    batching: true,
    interval: 5, // seconds
  },

  // Prometheus Configuration
  prometheus: {
    enabled: process.env.PROMETHEUS_ENABLED === "true",
    port: process.env.PROMETHEUS_PORT || 9090,
    endpoint: "/metrics",
    defaultLabels: {
      app: "hybrid-ats",
      env: process.env.NODE_ENV || "development",
      service: "backend",
    },
  },

  // OpenTelemetry Configuration
  opentelemetry: {
    enabled: process.env.OTEL_ENABLED === "true",
    serviceName: "hybrid-ats-backend",
    serviceVersion: "1.0.0",

    // Grafana Cloud OTLP endpoints
    traces: {
      endpoint:
        process.env.OTEL_TRACES_ENDPOINT ||
        "https://tempo-us-central1.grafana.net/otlp",
      headers: {
        Authorization: `Basic ${process.env.GRAFANA_CLOUD_OTLP_AUTH || ""}`,
      },
    },

    metrics: {
      endpoint:
        process.env.OTEL_METRICS_ENDPOINT ||
        "https://prometheus-us-central1.grafana.net/api/prom/push",
      headers: {
        Authorization: `Basic ${process.env.GRAFANA_CLOUD_OTLP_AUTH || ""}`,
      },
    },
  },
};

export default grafanaConfig;
