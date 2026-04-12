const fs = require("fs");
const pdf = require('pdf-parse');

const User = require("../../models/User");

const analyzeResumeController = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.resumeUrl) {
      return res.status(400).json({
        success: false,
        message: "Upload resume first"
      });
    }

    const path = require('path');
    const filePath = path.join(__dirname, '../../../', user.resumeUrl);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: "Resume file not found on disk" });
    }

    const buffer = fs.readFileSync(filePath);
    let data;
    try {
      data = await pdf(buffer);
    } catch (parseError) {
      console.error("PDF Parsing Error:", parseError.message);
      return res.status(422).json({
        success: false,
        message: "Failed to parse PDF content. Ensure file is a valid PDF."
      });
    }

    const text = data.text.toLowerCase();

    const skillPool = [
      "javascript",
      "node",
      "react",
      "mongodb",
      "java",
      "python",
      "sql",
      "express",
      "html",
      "css"
    ];

    const foundSkills = skillPool.filter(skill =>
      text.includes(skill)
    );

    const projectCount =
      (text.match(/project/g) || []).length;

    const score =
      Math.min(100, foundSkills.length * 10 + projectCount * 5);

    const result = {
      skills: foundSkills,
      projectCount,
      score,
      strengths: foundSkills.slice(0, 3),
      missingSkills: skillPool.filter(
        s => !foundSkills.includes(s)
      ).slice(0, 5)
    };

    user.resumeAnalysis = result;
    await user.save();

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    if (error.code === 'ENOENT') {
         return res.status(404).json({ success: false, message: "Resume file not found on disk" });
    }
    next(error);
  }
};

module.exports = analyzeResumeController;
