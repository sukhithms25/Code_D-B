const crypto = require('crypto');
const User = require('../../models/User');
const emailService = require('../../services/notifications/emailService');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError('Please provide an email address', 400));
  }

  const user = await User.findOne({ email });
  // We return success even if user not found to prevent email enumeration
  if (!user) {
    return res.status(200).json(new ApiResponse(200, null, 'If that email is registered, you will receive a reset link.'));
  }

  const resetToken = crypto.randomBytes(32).toString('hex');

  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 mins

  // Save the token fields
  await user.save({ validateBeforeSave: false });

  try {
    await emailService.sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json(new ApiResponse(200, null, 'If that email is registered, you will receive a reset link.'));
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Try again later.', 500));
  }
});
