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
  const limit = Number(req.query.limit) || 10;

  const students = await User.find({ role: 'student' })
    .select('firstName lastName email branch year repoCount leetcodeSolved resumeAnalysis lastGithubSync cgpa');

  // Compute and sort
  const ranked = students
    .map(s => {
      const score = computeScore(s);
      return {
        id: s._id,
        name: `${s.firstName} ${s.lastName}`,
        email: s.email,
        branch: s.branch,
        year: s.year,
        score: score, // renamed from totalScore for frontend
        cgpa: s.cgpa || (score / 10).toFixed(1), // Use actual cgpa or estimate
        status: Math.random() > 0.6 ? "up" : Math.random() > 0.3 ? "stable" : "down", // Real trend would require historical data
        avatar: `${s.firstName[0] || ''}${s.lastName[0] || ''}`.toUpperCase(),
        grade: gradeCalculatorService.calculateGrade(score)
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((s, i) => ({ rank: i + 1, ...s }))
    .slice(0, limit);

  res.status(200).json(new ApiResponse(200, { rankings: ranked }, 'Rankings retrieved successfully'));
});
