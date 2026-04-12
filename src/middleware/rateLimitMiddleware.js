const rateLimit = require('express-rate-limit');

/**
 * Standard response when a client is rate-limited.
 * Returns structured JSON matching the project's error format
 * so the frontend can display a meaningful message.
 */
const rateLimitHandler = (req, res) => {
  res.status(429).json({
    success: false,
    message: 'Too many requests. Please slow down and try again later.',
    retryAfter: Math.ceil(req.rateLimit.resetTime / 1000 - Date.now() / 1000),
  });
};

/**
 * AUTH rate limiter — Strict.
 *
 * Targets: POST /api/v1/auth/login, /auth/register, /auth/refresh
 * Allows 10 attempts per 15-minute window per IP.
 * After 10 fails → 429 until window resets.
 * This blocks brute-force and credential-stuffing attacks.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,        // 15 minutes
  max: 10,                           // 10 attempts max
  standardHeaders: true,             // Return RateLimit-* headers (RFC 6585)
  legacyHeaders: false,              // Disable X-RateLimit-* legacy headers
  skipSuccessfulRequests: true,      // Only count failed attempts
  handler: rateLimitHandler,
});

/**
 * GENERAL API rate limiter — Normal.
 *
 * Targets: all /api/* routes (applied in app.js)
 * Window and max configurable via .env so production can be
 * tightened without a code change.
 *
 * Defaults: 100 requests per 15 minutes per IP.
 */
const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  // Trust the X-Forwarded-For header from proxies (Render, Vercel, Nginx)
  // so the real client IP is used, not the proxy IP
  skip: (req) => process.env.NODE_ENV === 'test', // Never rate-limit test runs
  handler: rateLimitHandler,
});

module.exports = { authLimiter, apiLimiter };
