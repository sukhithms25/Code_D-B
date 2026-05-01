const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const AppError = require('../../utils/AppError');

/**
 * PATCH /api/v1/auth/update-password
 * Allows logged-in user to change their password by verifying the old one first.
 */
module.exports = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return next(new AppError('Both oldPassword and newPassword are required', 400));
    }

    if (newPassword.length < 8) {
      return next(new AppError('New password must be at least 8 characters', 400));
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return next(new AppError('Current password is incorrect', 401));
    }

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};
