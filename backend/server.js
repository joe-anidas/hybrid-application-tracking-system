import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from './routes/authRoutes.js'

const app = express();

// CORS configuration
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: allowedOrigins, // allow Vite dev server (and any others via env)
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  // credentials: true, // enable if you start using cookies/auth headers
};

// Middleware
app.use(cors(corsOptions)); // enable CORS for frontend origin
// Handle preflight requests globally (Express 5 doesn't accept '*' path patterns)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});
app.use(express.json()); // parse JSON body

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/hybrid-ats")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Mount routes
app.use('/api/auth', authRoutes)

// ✅ Start server
const PORT = process.env.PORT || 3000;

// Health check / root route
app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "hybrid-ats-backend" });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
