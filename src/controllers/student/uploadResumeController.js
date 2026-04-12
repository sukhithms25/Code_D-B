const User = require("../../models/User");

const uploadResumeController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file required"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        resumeUrl: `/uploads/resumes/${req.file.filename}`,
        resumeUploadedAt: new Date()
      },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      data: user
    });

  } catch (error) {
    next(error);
  }
};

module.exports = uploadResumeController;
