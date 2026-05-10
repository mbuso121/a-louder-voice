import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
 
import authRoutes    from "./routes/authRoutes.js";
import postRoutes    from "./routes/postRoutes.js";
import adminRoutes   from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
 
import { apiLimiter } from "./middleware/rateLimiter.js";
import { sanitizeBody } from "./middleware/sanitize.js";
 
dotenv.config();
 
const app = express();
 
// ── SECURITY HEADERS ──────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options",  "nosniff");
  res.setHeader("X-Frame-Options",         "DENY");
  res.setHeader("X-XSS-Protection",        "1; mode=block");
  res.setHeader("Referrer-Policy",         "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy",      "geolocation=(), camera=(), microphone=()");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
  next();
});
 
// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",")
  .map(o => o.trim())
  .filter(Boolean);
 
app.use(cors({
  origin: (origin, cb) => {
    // Allow no-origin requests (Railway health checks, curl, Postman)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    console.warn(`CORS blocked: "${origin}" | allowed: ${allowedOrigins.join(", ")}`);
    cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
 
// ── REQUEST LOGGING ──────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    const level = res.statusCode >= 500 ? "ERROR" : res.statusCode >= 400 ? "WARN" : "INFO";
    console.log(`[${level}] ${req.method} ${req.path} ${res.statusCode} ${ms}ms`);
  });
  next();
});
 
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(sanitizeBody);
 
// ── DATABASE ──────────────────────────────────────────────────────────────────
const mongoOptions = { maxPoolSize: 100, serverSelectionTimeoutMS: 5000, socketTimeoutMS: 45000, family: 4 };
mongoose.connect(process.env.MONGO_URI, mongoOptions)
  .then(() => console.log(" MongoDB connected"))
  .catch(err => console.error(" MongoDB:", err));
mongoose.connection.on("disconnected", () => {
  console.warn("  MongoDB disconnected — reconnecting...");
  mongoose.connect(process.env.MONGO_URI, mongoOptions).catch(console.error);
});
 
// ── ROUTES ────────────────────────────────────────────────────────────────────
app.use("/api/auth",    authRoutes);
app.use("/api/posts",   apiLimiter, postRoutes);
app.use("/api/admin",   adminRoutes);
app.use("/api/contact", contactRoutes);
 
app.get("/api/health", (req, res) => res.json({ status: "ok", ts: Date.now() }));
 
// ── EMAIL TEST ────────────────────────────────────────────────────────────────
app.get("/api/test-email", async (req, res) => {
  try {
    const { sendContactEmail } = await import("./utils/sendEmail.js");
    await sendContactEmail({
      fromName: "Test",
      fromEmail: process.env.EMAIL_USER,
      subject: "Test email from A Louder Voice",
      message: "If you see this, email is working!"
    });
    res.json({ success: true, sent_to: process.env.CONTACT_EMAIL });
  } catch (err) {
    console.error("Email test failed:", err.message, err.code);
    res.status(500).json({ error: err.message, code: err.code });
  }
});
 
// ── ERROR HANDLER ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  // Always log the full error on the server
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} → ${status}:`, err.message);
  if (err.stack) console.error(err.stack);
 
  // In production hide internals; in dev expose the real message
  const message = process.env.NODE_ENV === "production"
    ? (status < 500 ? err.message : "An unexpected error occurred.")
    : err.message;
 
  res.status(status).json({ error: message });
});
app.use((req, res) => res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` }));
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));