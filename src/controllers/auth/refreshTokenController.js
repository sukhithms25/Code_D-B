const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');
const tokenService = require('../../services/auth/tokenService');

module.exports = catchAsync(async (req, res, next) => {
  const refreshToken = req.body.refreshToken || req.cookies?.jwt;

  if (!refreshToken) {
    return next(new AppError('Refresh token is required', 400));
  }

  try {
    const decoded = tokenService.verifyRefreshToken(refreshToken);
    const newAccessToken = tokenService.generateAccessToken(decoded.id, decoded.role);
    
    res.status(200).json(new ApiResponse(200, {
      accessToken: newAccessToken
    }, 'Token refreshed successfully'));
  } catch (error) {
    return next(new AppError('Invalid or expired refresh token', 401));
  }
});
