import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from 'path'
import { fileURLToPath } from 'url'
import jwt from 'jsonwebtoken'
import authRoutes from './routes/authRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'
import userRoutes from './routes/userRoutes.js'
import auditLogRoutes from './routes/auditLogRoutes.js'
import botMimicRoutes from './routes/botMimicRoutes.js'
import auditMiddleware from './middleware/auditMiddleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

// ✅ Audit logging middleware - logs all API activity
app.use(auditMiddleware)

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/hybrid-ats")
  .then(() => {
    console.log("✅ MongoDB connected")
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Mount routes
app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/users', userRoutes)
app.use('/api/audit-logs', auditLogRoutes)
app.use('/api/bot-mimic', botMimicRoutes)

// Serve uploaded files with authentication
app.get('/uploads/resumes/:filename', (req, res) => {
  try {
    // Get token from query parameter or Authorization header
    const token = req.query.token || req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' })
      }

      // Token is valid, serve the file
      const filePath = path.join(__dirname, 'uploads', 'resumes', req.params.filename)
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error('Error sending file:', err)
          res.status(404).json({ message: 'File not found' })
        }
      })
    })
  } catch (error) {
    console.error('Error serving resume:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Serve other static files (if needed)
app.use('/uploads', express.static('uploads'))

// ✅ Start server
const PORT = process.env.PORT || 3000;

// Health check / root route
app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "hybrid-ats-backend" });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
