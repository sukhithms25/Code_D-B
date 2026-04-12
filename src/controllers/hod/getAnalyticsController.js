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
  const students = await User.find({ role: 'student' })
    .select('firstName lastName email branch year repoCount leetcodeSolved resumeAnalysis lastGithubSync');

  if (!students.length) {
    return res.status(200).json(new ApiResponse(200, {
      totalStudents: 0, avgScore: 0, topScore: 0, gradeDistribution: {}
    }, 'Analytics retrieved successfully'));
  }

  const scores = students.map(s => computeScore(s));
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const topScore = Math.max(...scores);

  const gradeDistribution = { 'A+': 0, A: 0, 'B+': 0, B: 0, C: 0, F: 0 };
  scores.forEach(score => {
    const grade = gradeCalculatorService.calculateGrade(score);
    gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;
  });

  const githubConnectedCount = students.filter(s => s.githubConnected).length;
  const leetcodeConnectedCount = students.filter(s => s.leetcodeUsername).length;

  const branchBreakdown = {};
  students.forEach(s => {
    if (s.branch) branchBreakdown[s.branch] = (branchBreakdown[s.branch] || 0) + 1;
  });

  res.status(200).json(new ApiResponse(200, {
    totalStudents:         students.length,
    avgScore,
    topScore,
    gradeDistribution,
    githubConnectedCount,
    leetcodeConnectedCount,
    branchBreakdown
  }, 'Analytics retrieved successfully'));
});
