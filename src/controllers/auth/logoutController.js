const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');
const tokenService = require('../../services/auth/tokenService');

module.exports = catchAsync(async (req, res, next) => {
  // Clear httpOnly cookie
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  const { refreshToken } = req.body;
  
  if (refreshToken) {
      try {
          tokenService.blacklistToken(refreshToken);
      } catch(e) { }
  }

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    try {
        tokenService.blacklistToken(token);
    } catch(e) { }
  }

  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});
