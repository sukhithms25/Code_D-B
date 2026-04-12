const User = require('../../models/User');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');
const scoringAlgorithmService = require('../../services/scoring/scoringAlgorithmService');
const gradeCalculatorService = require('../../services/scoring/gradeCalculatorService');

module.exports = catchAsync(async (req, res, next) => {
  const student = await User.findOne({
    _id: req.params.id,
    role: 'student'
  }).select('-password -passwordResetToken -passwordResetExpires');

  if (!student) {
    return next(new AppError('Student not found', 404));
  }

  // Compute live score
  const codingActivity  = Math.min(100, (student.repoCount || 0) * 2);
  const projects        = Math.min(100, (student.resumeAnalysis?.projectCount || 0) * 15);
  const problemSolving  = Math.min(100, (student.leetcodeSolved || 0) * 2);
  let consistency = 0;
  if (student.lastGithubSync) {
    const days = Math.floor((Date.now() - new Date(student.lastGithubSync)) / 86400000);
    if (days <= 7) consistency = 100;
    else if (days <= 30) consistency = 50;
  }

  const totalScore = scoringAlgorithmService.calculateTotalScore({
    codingActivity, projects, problemSolving, consistency
  });
  const grade = gradeCalculatorService.calculateGrade(totalScore);

  res.status(200).json(new ApiResponse(200, {
    profile: student,
    score: {
      totalScore,
      grade,
      breakdown: { codingActivity, projects, problemSolving, consistency }
    }
  }, 'Student details retrieved successfully'));
});
