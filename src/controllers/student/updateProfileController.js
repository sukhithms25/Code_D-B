const User = require("../../models/User");

const updateProfileController = async (req, res, next) => {
  try {
    const updates = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      cgpa: req.body.cgpa,
      branch: req.body.branch,
      year: req.body.year,
      bio: req.body.bio,
      skills: req.body.skills,
      linkedinUrl: req.body.linkedinUrl
    };

    Object.keys(updates).forEach(
      key => updates[key] === undefined && delete updates[key]
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    next(error);
  }
};

module.exports = updateProfileController;
