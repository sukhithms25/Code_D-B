const Joi = require('joi');

exports.register = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required'
  }),
  firstName: Joi.string().max(50).required().messages({
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().max(50).required().messages({
    'any.required': 'Last name is required'
  }),
  role: Joi.string().valid('student', 'hod', 'admin').default('student'),
  department: Joi.string().allow('', null).when('role', {
    is: 'hod',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  branch: Joi.string().allow('', null).when('role', {
    is: 'student',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  year: Joi.number().allow('', null).when('role', {
    is: 'student',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

exports.login = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required for login'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required for login'
  })
});

exports.refreshToken = Joi.object({
  refreshToken: Joi.string().optional() // Optional in body if using cookies
});
