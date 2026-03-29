const resumeAnalyzerService = require('../../services/ai/resumeAnalyzerService');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const { resumeText, targetRole } = req.body;
  
  if (!resumeText) {
    return next(new AppError('Please provide resume text', 400));
  }

  const skills = await resumeAnalyzerService.extractSkills(resumeText);
  const expData = await resumeAnalyzerService.calculateExperienceLevel(resumeText);
  let gaps = [];
  
  if (targetRole) {
    gaps = await resumeAnalyzerService.identifyGaps(resumeText, targetRole);
  }

  res.status(200).json(new ApiResponse(200, {
     skills,
     experience: expData,
     gaps
  }, 'Resume analyzed successfully'));
});
