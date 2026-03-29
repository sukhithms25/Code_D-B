const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] : '';
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data.`;
  const appErr = new AppError(message, 400);
  appErr.errorsArray = errors; // Map mongoose validations to array
  return appErr;
};

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  
  let error = { ...err, message: err.message, name: err.name, code: err.code, isOperational: err.isOperational };
  let errorsArray = err.errorsArray || [err.message];
  
  if (error.name === 'CastError') {
     error = handleCastErrorDB(error);
     errorsArray = [error.message];
  }
  if (error.code === 11000) {
     error = handleDuplicateFieldsDB(error);
     errorsArray = [error.message];
  }
  if (error.name === 'ValidationError') {
     error = handleValidationErrorDB(error);
     errorsArray = error.errorsArray;
  }
  if (error.name === 'JsonWebTokenError') {
     error = handleJWTError();
     errorsArray = [error.message];
  }
  if (error.name === 'TokenExpiredError') {
     error = handleJWTExpiredError();
     errorsArray = [error.message];
  }

  // Handle unhandled programming errors cleanly in prod
  if (process.env.NODE_ENV === 'production' && !error.isOperational) {
    logger.error('ERROR 💥', err);
    error.message = 'Something went very wrong!';
    errorsArray = ['Internal Server Error'];
    error.statusCode = 500;
  }

  // Send strict structured response format
  res.status(error.statusCode || err.statusCode).json({
    success: false,
    message: error.message || err.message,
    errors: process.env.NODE_ENV === 'development' && !error.isOperational 
      ? [err.message, err.stack] 
      : errorsArray
  });
};
