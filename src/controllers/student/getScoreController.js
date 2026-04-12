const User = require("../../models/User");
const scoringAlgorithmService = require("../../services/scoring/scoringAlgorithmService");
const gradeCalculatorService = require("../../services/scoring/gradeCalculatorService");

/**
 * GET /api/v1/student/score
 *
 * Calculates the student's live performance score from their DB data.
 *
 * Formula (pulled from SCORE_WEIGHTS constants):
 *   codingActivity  (30%) — based on repoCount from GitHub
 *   projects        (30%) — based on resumeAnalysis.projectCount
 *   problemSolving  (20%) — based on LeetCode solvedCount (when synced)
 *   consistency     (20%) — based on lastGithubSync recency
 */
module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // --- Coding Activity (30%) ---
    // Scale repoCount (0–50 repos) to a 0–100 score
    const repoCount = user.repoCount || 0;
    const codingActivity = Math.min(100, repoCount * 2);

    // --- Projects (30%) ---
    // Use resume analysis project count if available
    const projectCount = user.resumeAnalysis?.projectCount || 0;
    const projects = Math.min(100, projectCount * 15);

    // --- Problem Solving (20%) ---
    // Use LeetCode solved count (when synced); 0 until then
    const leetcodeSolved = user.leetcodeSolved || 0;
    const problemSolving = Math.min(100, leetcodeSolved * 2);

    // --- Consistency (20%) ---
    // 100 if synced in last 7 days, 50 if in last 30 days, else 0
    let consistency = 0;
    if (user.lastGithubSync) {
      const daysSinceSync = Math.floor(
        (Date.now() - new Date(user.lastGithubSync)) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceSync <= 7)  consistency = 100;
      else if (daysSinceSync <= 30) consistency = 50;
    }

    const totalScore = scoringAlgorithmService.calculateTotalScore({
      codingActivity,
      projects,
      problemSolving,
      consistency
    });

    const grade = gradeCalculatorService.calculateGrade(totalScore);

    return res.status(200).json({
      success: true,
      data: {
        totalScore,
        grade,
        breakdown: {
          codingActivity: { score: codingActivity, weight: "30%", source: `${repoCount} GitHub repos` },
          projects:       { score: projects,       weight: "30%", source: `${projectCount} resume projects` },
          problemSolving: { score: problemSolving, weight: "20%", source: `${leetcodeSolved} LeetCode solved` },
          consistency:    { score: consistency,    weight: "20%", source: user.lastGithubSync ? "GitHub synced" : "Not synced" }
        }
      }
    });

  } catch (error) {
    next(error);
  }
};
