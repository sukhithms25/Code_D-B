const User = require('../../models/User');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');
const scoringAlgorithmService = require('../../services/scoring/scoringAlgorithmService');
const gradeCalculatorService = require('../../services/scoring/gradeCalculatorService');

/**
 * Computes a live score for a user document.
 */
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

  const totalScore = scoringAlgorithmService.calculateTotalScore({
    codingActivity, projects, problemSolving, consistency
  });
  const grade = gradeCalculatorService.calculateGrade(totalScore);
  return { totalScore, grade };
};

module.exports = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, search = '', branch = '' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  // Build filter
  const filter = { role: 'student' };
  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName:  { $regex: search, $options: 'i' } },
      { email:     { $regex: search, $options: 'i' } }
    ];
  }
  if (branch) filter.branch = branch;

  const [students, total] = await Promise.all([
    User.find(filter)
        .select('firstName lastName email branch year cgpa repoCount leetcodeSolved resumeAnalysis lastGithubSync githubUsername githubConnected')
        .skip(skip)
        .limit(Number(limit)),
    User.countDocuments(filter)
  ]);

  const enriched = students.map(s => {
    const { totalScore, grade } = computeScore(s);
    let risk = "Low";
    if (totalScore < 40) risk = "High";
    else if (totalScore < 70) risk = "Medium";

    let status = "Average";
    if (totalScore >= 85) status = "Excellent";
    else if (totalScore < 40) status = "At Risk";
    else if (totalScore < 60) status = "Underperforming";

    return {
      _id:             s._id,
      id:              s._id.toString().substring(0, 9).toUpperCase(), // Mock UID for frontend format
      name:            `${s.firstName} ${s.lastName}`,
      email:           s.email,
      branch:          s.branch,
      year:            s.year,
      cgpa:            s.cgpa || (totalScore / 10).toFixed(1),
      progress:        totalScore,
      status:          status,
      risk:            risk,
      githubConnected: s.githubConnected,
      githubUsername:  s.githubUsername,
      repoCount:       s.repoCount,
      leetcodeSolved:  s.leetcodeSolved,
      totalScore,
      grade
    };
  });

  res.status(200).json(new ApiResponse(200, {
    students: enriched,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) }
  }, 'Students retrieved successfully'));
});
