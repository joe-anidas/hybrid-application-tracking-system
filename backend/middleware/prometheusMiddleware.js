/**
 * Prometheus Metrics Middleware
 * Tracks HTTP request metrics for monitoring
 */

import { httpRequestDuration, httpRequestTotal } from "../config/prometheus.js";

/**
 * Middleware to track HTTP request metrics
 */
export const prometheusMiddleware = (req, res, next) => {
  // Start timer
  const start = Date.now();

  // Track response completion
  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000; // Convert to seconds
    const route = req.route ? req.route.path : req.path || "unknown";
    const statusCode = res.statusCode.toString();

    // Record metrics
    httpRequestDuration.labels(req.method, route, statusCode).observe(duration);

    httpRequestTotal.labels(req.method, route, statusCode).inc();
  });

  next();
};

export default prometheusMiddleware;
