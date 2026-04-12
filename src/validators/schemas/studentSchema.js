const Joi = require('joi');

exports.updateProfile = Joi.object({
  firstName: Joi.string().max(50),
  lastName: Joi.string().max(50),
  cgpa: Joi.number().min(0).max(10).messages({
    'number.min': 'CGPA cannot be negative',
    'number.max': 'CGPA cannot exceed 10'
  }),
  branch: Joi.string().max(50),
  year: Joi.number().integer().min(1).max(5),
  bio: Joi.string().max(500),
  interests: Joi.array().items(Joi.string().max(50)),
  skills: Joi.array().items(Joi.string().max(50)),
  linkedinUrl: Joi.string().uri().pattern(/^https?:\/\/(www\.)?linkedin\.com\/.*/).messages({
    'string.pattern.base': 'Must be a valid LinkedIn URL'
  })
}).min(1).messages({
  'object.min': 'Please provide at least one field to update'
});
