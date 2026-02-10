import pinoHttp from "pino-http";
import logger from "../config/logger.js";

/**
 * Pino HTTP middleware for request/response logging
 * Provides structured HTTP logging with automatic request/response tracking
 */
export const pinoHttpMiddleware = pinoHttp({
  logger,

  // Custom log level based on response status
  customLogLevel: function (req, res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return "warn";
    } else if (res.statusCode >= 500 || err) {
      return "error";
    } else if (res.statusCode >= 300 && res.statusCode < 400) {
      return "silent";
    }
    return "info";
  },

  // Custom success message
  customSuccessMessage: function (req, res) {
    if (res.statusCode === 404) {
      return "Resource not found";
    }
    return `${req.method} ${req.url}`;
  },

  // Custom error message
  customErrorMessage: function (req, res, err) {
    return `${req.method} ${req.url} - ${err.message}`;
  },

  // Serialize request - exclude sensitive data
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      path: req.path,
      // Query params (sanitized)
      query: req.query,
      // Don't log request body in HTTP middleware (handled by audit middleware)
      // headers: req.headers, // Uncomment if needed, but be careful with auth headers
      remoteAddress: req.remoteAddress,
      remotePort: req.remotePort,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },

  // Automatically log request completion
  autoLogging: {
    // Don't log these paths
    ignore: (req) => {
      // Skip health check endpoint
      if (req.url === "/" && req.method === "GET") return true;
      // Skip static file requests
      if (req.url?.startsWith("/uploads/")) return true;
      // Skip swagger docs
      if (req.url?.startsWith("/api-docs")) return true;
      return false;
    },
  },

  // Custom attribute keys
  customAttributeKeys: {
    req: "request",
    res: "response",
    err: "error",
    responseTime: "duration",
  },
});

export default pinoHttpMiddleware;
