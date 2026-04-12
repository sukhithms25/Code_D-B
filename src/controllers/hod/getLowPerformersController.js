const User = require('../../models/User');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');
const scoringAlgorithmService = require('../../services/scoring/scoringAlgorithmService');
const gradeCalculatorService = require('../../services/scoring/gradeCalculatorService');

const computeScore = (user) => {
  const codingActivity  = Math.min(100, (user.repoCount || 0) * 2);
  const projects        = Math.min(100, (user.resumeAnalysis?.projectCount || 0) * 15);
  const problemSolving  = Math.min(100, (user.leetcodeSolved || 0) * 2);
  let consistency = 0;
  if (user.lastGithubSync) {
    const days = Math.floor((Date.now() - new Date(user.lastGithubSync)) / 86400000);
    if (days <= 7) consistency = 100;
    else if (days <= 30) consistency = 50;
  }
  return scoringAlgorithmService.calculateTotalScore({
    codingActivity, projects, problemSolving, consistency
  });
};

module.exports = catchAsync(async (req, res, next) => {
  const threshold = Number(req.query.threshold) || 50;
  const students = await User.find({ role: 'student' })
    .select('firstName lastName email branch year repoCount leetcodeSolved resumeAnalysis lastGithubSync');

  const low = students
    .map(s => ({ _id: s._id, name: `${s.firstName} ${s.lastName}`, email: s.email, branch: s.branch, year: s.year, totalScore: computeScore(s), grade: gradeCalculatorService.calculateGrade(computeScore(s)) }))
    .filter(s => s.totalScore < threshold)
    .sort((a, b) => a.totalScore - b.totalScore);

  res.status(200).json(new ApiResponse(200, low, 'Low performers retrieved successfully'));
});
