const cors = require('cors');

/**
 * Build the list of allowed origins from the environment.
 * CORS_ORIGINS is a comma-separated string in .env:
 *   CORS_ORIGINS=http://localhost:3000,https://code-db.vercel.app
 *
 * In development, if CORS_ORIGINS is not set we fall back to
 * localhost:3000 so the dev server always works out of the box.
 */
const buildAllowedOrigins = () => {
  const raw = process.env.CORS_ORIGINS || process.env.FRONTEND_URL || '';
  if (!raw) return ['http://localhost:3000'];
  return raw.split(',').map((o) => o.trim()).filter(Boolean);
};

const allowedOrigins = buildAllowedOrigins();

const corsOptions = {
  /**
   * Dynamic origin check:
   * - In development, allow all origins so Postman / Thunder Client
   *   work without any config.
   * - In production, only allow explicitly listed origins.
   */
  origin: (origin, callback) => {
    // Allow server-to-server calls (no Origin header) and known origins
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Development bypass — never block in dev
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    callback(new Error(`CORS: Origin '${origin}' is not allowed.`));
  },

  // Allow cookies / Authorization headers to be sent cross-origin
  credentials: true,

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
  ],

  // Preflight responses are cached for 10 minutes
  maxAge: 600,
};

module.exports = cors(corsOptions);
