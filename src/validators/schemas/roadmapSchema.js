const Joi = require('joi');

exports.generateRoadmap = Joi.object({
  skillLevel: Joi.string().valid('beginner', 'intermediate', 'advanced').default('beginner'),
  weeks: Joi.number().integer().min(1).max(12).default(4).messages({
    'number.min': 'Roadmap must be at least 1 week',
    'number.max': 'Roadmap cannot exceed 12 weeks'
  })
});

exports.updateProgress = Joi.object({
  roadmapId: Joi.string().hex().length(24).required().messages({
    'string.length': 'Invalid Roadmap ID format',
    'any.required': 'Roadmap ID is required'
  }),
  taskId: Joi.string().required().messages({
    'any.required': 'Task ID is required'
  }),
  isCompleted: Joi.boolean().required().messages({
    'any.required': 'isCompleted flag is required'
  })
});
