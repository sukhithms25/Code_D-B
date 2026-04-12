const Joi = require('joi');

/**
 * Joi validation schema for submitting a student evaluation.
 *
 * Field names match the Evaluation mongoose model exactly:
 *   codingScore, projectScore, problemSolvingScore, consistencyScore
 *
 * All scores are 0–100. totalScore and grade are computed server-side
 * by scoringAlgorithmService — clients do NOT submit them.
 */
module.exports = Joi.object({
  codingScore:        Joi.number().min(0).max(100).required().messages({
    'number.min':    'Coding score cannot be negative',
    'number.max':    'Coding score cannot exceed 100',
    'any.required':  'Coding score is required',
  }),
  projectScore:       Joi.number().min(0).max(100).required().messages({
    'number.min':    'Project score cannot be negative',
    'number.max':    'Project score cannot exceed 100',
    'any.required':  'Project score is required',
  }),
  problemSolvingScore: Joi.number().min(0).max(100).required().messages({
    'number.min':    'Problem solving score cannot be negative',
    'number.max':    'Problem solving score cannot exceed 100',
    'any.required':  'Problem solving score is required',
  }),
  consistencyScore:   Joi.number().min(0).max(100).required().messages({
    'number.min':    'Consistency score cannot be negative',
    'number.max':    'Consistency score cannot exceed 100',
    'any.required':  'Consistency score is required',
  }),
});
