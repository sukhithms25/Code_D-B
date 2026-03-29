const Joi = require('joi');

exports.githubSync = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'GitHub access token is required'
  })
});

exports.leetcodeSync = Joi.object({
  username: Joi.string().max(50).required().messages({
    'any.required': 'LeetCode username is required',
    'string.max': 'Username cannot exceed 50 characters'
  })
});
