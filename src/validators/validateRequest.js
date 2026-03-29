const AppError = require('../utils/AppError');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true 
    });
    
    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      
      const appErr = new AppError('Validation failed', 400);
      appErr.errorsArray = errorDetails; // Pack array natively to trigger error format structure
      return next(appErr);
    }
    
    req.body = value;
    next();
  };
};

module.exports = validateRequest;
