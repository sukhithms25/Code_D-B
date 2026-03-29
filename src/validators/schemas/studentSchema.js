const Joi = require('joi');

exports.updateProfile = Joi.object({
  CGPA: Joi.number().min(0).max(10).messages({
    'number.min': 'CGPA cannot be negative',
    'number.max': 'CGPA cannot exceed 10'
  }),
  interests: Joi.array().items(Joi.string().max(50)),
  skills: Joi.array().items(Joi.string().max(50)),
  githubUrl: Joi.string().uri().pattern(/^https?:\/\/(www\.)?github\.com\/.*/).messages({
    'string.pattern.base': 'Must be a valid GitHub URL'
  }),
  linkedinUrl: Joi.string().uri().pattern(/^https?:\/\/(www\.)?linkedin\.com\/.*/).messages({
    'string.pattern.base': 'Must be a valid LinkedIn URL'
  })
}).min(1).messages({
  'object.min': 'Please provide at least one field to update'
});
