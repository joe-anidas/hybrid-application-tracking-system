import pino from "pino";
import grafanaConfig from "./grafana.js";

// Determine log level from environment
const logLevel = process.env.LOG_LEVEL || "info";
const isProduction = process.env.NODE_ENV === "production";
const lokiEnabled = grafanaConfig.loki.enabled && isProduction;

// Configure transport based on environment
function getTransport() {
  // Development: use pino-pretty
  if (!isProduction) {
    return {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
        singleLine: false,
        messageFormat: "{levelLabel} - {msg}",
      },
    };
  }

  // Production with Loki: use both stdout and Loki
  if (lokiEnabled) {
    return {
      targets: [
        // Send to stdout (for local logging)
        {
          target: "pino/file",
          level: logLevel,
          options: {
            destination: 1, // stdout
          },
        },
        // Send to Grafana Loki
        {
          target: "pino-loki",
          level: logLevel,
          options: {
            batching: grafanaConfig.loki.batching,
            interval: grafanaConfig.loki.interval,
            host: `https://${grafanaConfig.loki.host}`,
            basicAuth: {
              username: grafanaConfig.loki.basicAuth.username,
              password: grafanaConfig.loki.basicAuth.password,
            },
            labels: grafanaConfig.loki.labels,
          },
        },
      ],
    };
  }

  // Production without Loki: just stdout
  return undefined;
}

// Configure Pino logger
const logger = pino({
  level: logLevel,
  transport: getTransport(),
  // Production logging configuration
  formatters: isProduction
    ? {
        level: (label) => {
          return { level: label };
        },
      }
    : undefined,
  // Include timestamp
  timestamp: pino.stdTimeFunctions.isoTime,
  // Serialize errors properly
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
});

/**
 * Create a child logger with additional context
 * @param {Object} bindings - Additional context to bind to logger
 * @returns {Object} Child logger instance
 */
export function createLogger(bindings = {}) {
  return logger.child(bindings);
}

/**
 * Log audit event with structured data
 * @param {Object} auditData - Audit log data
 */
export function logAudit(auditData) {
  logger.info(
    {
      type: "audit",
      ...auditData,
    },
    `${auditData.action}: ${auditData.actionDescription}`,
  );
}

export default logger;
