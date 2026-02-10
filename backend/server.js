import "dotenv/config";

// ⚡ Initialize OpenTelemetry FIRST (before any other imports)
import { initializeOpenTelemetry } from "./config/opentelemetry.js";
initializeOpenTelemetry();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import logger from "./config/logger.js";
import pinoHttpMiddleware from "./middleware/pinoHttpMiddleware.js";
import prometheusMiddleware from "./middleware/prometheusMiddleware.js";
import {
  getMetrics,
  getContentType,
  dbConnectionGauge,
} from "./config/prometheus.js";
import grafanaConfig from "./config/grafana.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import auditLogRoutes from "./routes/auditLogRoutes.js";
import botMimicRoutes from "./routes/botMimicRoutes.js";
import { startAutoProcess } from "./services/autoProcessService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
app.use(express.json());

// ✅ Prometheus metrics middleware - track HTTP request metrics
if (grafanaConfig.prometheus.enabled) {
  app.use(prometheusMiddleware);
}

// ✅ Health check endpoint (before other routes to avoid logging)
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "ats-backend",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Prometheus metrics endpoint
if (grafanaConfig.prometheus.enabled) {
  app.get(grafanaConfig.prometheus.endpoint, async (_req, res) => {
    try {
      res.set("Content-Type", getContentType());
      const metrics = await getMetrics();
      res.send(metrics);
    } catch (error) {
      logger.error({ err: error }, "Error generating metrics");
      res.status(500).send("Error generating metrics");
    }
  });
}

// ✅ Pino HTTP logging - structured request/response logging
app.use(pinoHttpMiddleware);

// ✅ Swagger API Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "ATS API Documentation",
    customCss: ".swagger-ui .topbar { display: none }",
    swaggerOptions: {
      persistAuthorization: true,
    },
  }),
);

// Swagger JSON endpoint
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/ats")
  .then(() => {
    logger.info("✅ MongoDB connected");
    if (grafanaConfig.prometheus.enabled) {
      dbConnectionGauge.set(1);
    }
  })
  .catch((err) => {
    logger.error({ err }, "❌ MongoDB connection error");
    if (grafanaConfig.prometheus.enabled) {
      dbConnectionGauge.set(0);
    }
  });

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/bot-mimic", botMimicRoutes);

// Serve uploaded files with authentication
app.get("/uploads/resumes/:filename", (req, res) => {
  try {
    // Get token from query parameter or Authorization header
    const token = req.query.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Verify token
    try {
      jwt.verify(token, process.env.JWT_SECRET || "dev_secret_change_me");
    } catch (_err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const filePath = path.join(
      __dirname,
      "uploads",
      "resumes",
      req.params.filename,
    );

    res.sendFile(filePath, (err) => {
      if (err) {
        logger.error(
          { err, filename: req.params.filename },
          "Error sending file",
        );
        res.status(404).json({ message: "File not found" });
      }
    });
  } catch (error) {
    logger.error({ err: error }, "Error serving resume");
    res.status(500).json({ message: "Internal server error" });
  }
});

// Serve other static files
app.use("/uploads", express.static("uploads"));

// Root route
app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "ats-backend",
    observability: {
      loki: grafanaConfig.loki.enabled,
      prometheus: grafanaConfig.prometheus.enabled,
      opentelemetry: grafanaConfig.opentelemetry.enabled,
    },
  });
});

// ✅ Start server
app.listen(PORT, () => {
  logger.info(
    {
      port: PORT,
      observability: {
        loki: grafanaConfig.loki.enabled,
        prometheus: grafanaConfig.prometheus.enabled,
        opentelemetry: grafanaConfig.opentelemetry.enabled,
      },
    },
    "🚀 Server running",
  );

  // Start auto-processing service after MongoDB connects
  setTimeout(() => {
    logger.info("🤖 Initializing Bot Mimic auto-processing service...");
    startAutoProcess();
  }, 2000);
});
