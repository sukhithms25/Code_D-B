const { protect } = require('./authMiddleware');
const authorizeRole = require('./roleMiddleware');
const errorMiddleware = require('./errorMiddleware');
const validationMiddleware = require('./validationMiddleware');
const { authLimiter, apiLimiter } = require('./rateLimitMiddleware');
const corsMiddleware = require('./corsMiddleware');
const helmetMiddleware = require('./helmetMiddleware');
const requestLoggerMiddleware = require('./requestLoggerMiddleware');
const { uploadResume } = require('./fileUploadMiddleware');

module.exports = {
  protect,
  authorizeRole,
  errorMiddleware,
  validationMiddleware,
  authLimiter,
  apiLimiter,
  corsMiddleware,
  helmetMiddleware,
  requestLoggerMiddleware,
  uploadResume,
};
