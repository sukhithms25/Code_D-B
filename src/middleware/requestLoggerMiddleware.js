const morgan = require('morgan');
const logger = require('../utils/logger');

/**
 * Pipe Morgan's HTTP log output through Winston.
 * This keeps all logs in one place (Winston) instead of
 * mixing Morgan's stdout with Winston's file/console output.
 */
const morganStream = {
  write: (message) => {
    // Morgan appends a trailing newline — strip it before passing to Winston
    logger.info(message.trim());
  },
};

/**
 * Routes to skip logging for (noisy health-check pings from
 * uptime monitors hitting GET /health every 30s would clutter logs).
 */
const skipRoutes = ['/health', '/favicon.ico'];

const skipFn = (req) => skipRoutes.includes(req.originalUrl);

/**
 * Development: concise colourised output
 *   GET /api/v1/student/profile 200 14ms
 *
 * Production: Apache Combined Log Format
 *   ::1 - - [12/Apr/2026] "GET /api/v1/student/profile HTTP/1.1" 200 512
 *   Suitable for ingestion by log aggregators (Datadog, Logtail, CloudWatch).
 */
const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

module.exports = morgan(format, {
  stream: morganStream,
  skip: skipFn,
});
