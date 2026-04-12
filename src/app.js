const express = require('express');
const path = require('path');
const routes = require('./routes');
const AppError = require('./utils/AppError');
require('./models'); // Register all Mongoose models globally

// ─── Middleware imports (all from dedicated modules) ─────────────────────────
const helmetMiddleware      = require('./middleware/helmetMiddleware');
const corsMiddleware        = require('./middleware/corsMiddleware');
const requestLogger         = require('./middleware/requestLoggerMiddleware');
const errorMiddleware       = require('./middleware/errorMiddleware');
const { authLimiter, apiLimiter } = require('./middleware/rateLimitMiddleware');
// ─────────────────────────────────────────────────────────────────────────────

const app = express();

// ── 1. Security headers (must be first) ──────────────────────────────────────
app.use(helmetMiddleware);

// ── 2. CORS (before any route / body parsing to handle preflight OPTIONS) ────
app.use(corsMiddleware);

// ── 3. HTTP request logger ────────────────────────────────────────────────────
app.use(requestLogger);

// ── 4. Body parsers ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── 5. Serve uploaded resumes as static files ─────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── 6. Rate limiting ──────────────────────────────────────────────────────────
//   Auth limiter: strict (10 requests / 15 min) — brute-force protection
app.use('/api/v1/auth', authLimiter);
//   General limiter: normal (env-configured, default 100 / 15 min)
app.use('/api', apiLimiter);

const swaggerSetup = require('./config/swagger');

// ── 7. Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    uptime: process.uptime()
  });
});

// ── 8. Swagger Documentation ──────────────────────────────────────────────────
swaggerSetup(app);

// ── 9. API routes ─────────────────────────────────────────────────────────────
app.use('/api/v1', routes);

// ── 8. 404 handler — unknown routes ──────────────────────────────────────────
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ── 9. Global error handler (must be last) ────────────────────────────────────
app.use(errorMiddleware);

module.exports = app;
