/**
 * Prometheus Metrics Configuration
 * Custom application metrics for monitoring
 */

import client from "prom-client";
import grafanaConfig from "./grafana.js";

// Create a Registry
export const register = new client.Registry();

// Add default metrics (CPU, memory, etc.)
if (grafanaConfig.prometheus.enabled) {
  client.collectDefaultMetrics({
    register,
    labels: grafanaConfig.prometheus.defaultLabels,
    prefix: "hybrid_ats_",
  });
}

// Custom metrics for the application

// HTTP Request Duration Histogram
export const httpRequestDuration = new client.Histogram({
  name: "hybrid_ats_http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5], // seconds
  registers: [register],
});

// HTTP Request Counter
export const httpRequestTotal = new client.Counter({
  name: "hybrid_ats_http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

// Active Jobs Gauge
export const activeJobsGauge = new client.Gauge({
  name: "hybrid_ats_active_jobs_total",
  help: "Total number of active job postings",
  registers: [register],
});

// Applications Counter
export const applicationsCounter = new client.Counter({
  name: "hybrid_ats_applications_total",
  help: "Total number of job applications",
  labelNames: ["status"],
  registers: [register],
});

// Database Connection Gauge
export const dbConnectionGauge = new client.Gauge({
  name: "hybrid_ats_db_connections",
  help: "Number of active database connections",
  registers: [register],
});

// Authentication Attempts Counter
export const authAttemptsCounter = new client.Counter({
  name: "hybrid_ats_auth_attempts_total",
  help: "Total authentication attempts",
  labelNames: ["status", "type"], // status: success/failure, type: login/register
  registers: [register],
});

// Resume Upload Counter
export const resumeUploadCounter = new client.Counter({
  name: "hybrid_ats_resume_uploads_total",
  help: "Total number of resume uploads",
  labelNames: ["status"], // success/failure
  registers: [register],
});

// Auto-processing Duration
export const autoProcessDuration = new client.Histogram({
  name: "hybrid_ats_auto_process_duration_seconds",
  help: "Duration of auto-processing tasks",
  labelNames: ["task_type"],
  buckets: [0.1, 0.5, 1, 5, 10, 30, 60],
  registers: [register],
});

/**
 * Get all metrics in Prometheus format
 */
export async function getMetrics() {
  return register.metrics();
}

/**
 * Get metrics content type
 */
export function getContentType() {
  return register.contentType;
}

export default {
  register,
  getMetrics,
  getContentType,
  httpRequestDuration,
  httpRequestTotal,
  activeJobsGauge,
  applicationsCounter,
  dbConnectionGauge,
  authAttemptsCounter,
  resumeUploadCounter,
  autoProcessDuration,
};
