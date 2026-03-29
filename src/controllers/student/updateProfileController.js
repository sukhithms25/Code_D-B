const StudentProfile = require('../../models/StudentProfile');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const updates = {
    CGPA: req.body.CGPA,
    interests: req.body.interests,
    skills: req.body.skills,
    githubUrl: req.body.githubUrl,
    linkedinUrl: req.body.linkedinUrl
  };

  Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

  const profile = await StudentProfile.findOneAndUpdate(
    { userId: req.user._id },
    updates,
    { new: true, runValidators: true }
  ).populate('userId', 'firstName lastName email role');

  res.status(200).json(new ApiResponse(200, profile, 'Profile updated successfully'));
});
