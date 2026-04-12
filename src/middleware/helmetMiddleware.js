const helmet = require('helmet');

/**
 * Security headers for a REST API.
 *
 * Helmet sets the following headers by default:
 *   - X-DNS-Prefetch-Control
 *   - X-Frame-Options (clickjacking prevention)
 *   - X-Content-Type-Options (MIME sniffing prevention)
 *   - Referrer-Policy
 *   - X-XSS-Protection (legacy browsers)
 *   - X-Permitted-Cross-Domain-Policies
 *   - Strict-Transport-Security (HSTS — forces HTTPS)
 *   - X-Download-Options
 *
 * Note: Content-Security-Policy is intentionally skipped
 * because this is a pure JSON API, not a server-rendered
 * HTML application. CSP on APIs causes false positives.
 */
module.exports = helmet({
  // Disable CSP — this is a REST API, not a rendered web page
  contentSecurityPolicy: false,

  // Allow the uploads folder to be read by same-origin AND the
  // listed frontend origins (needed for resume PDF retrieval)
  crossOriginResourcePolicy: { policy: 'cross-origin' },

  // Enforce HTTPS — only active in production
  hsts: process.env.NODE_ENV === 'production'
    ? { maxAge: 31536000, includeSubDomains: true, preload: true }
    : false,
});
