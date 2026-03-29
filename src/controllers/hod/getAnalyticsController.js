const Evaluation = require('../../models/Evaluation');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const stats = await Evaluation.aggregate([
    {
      $group: {
        _id: null,
        avgTotalScore: { $avg: '$totalScore' },
        avgCodingScore: { $avg: '$codingScore' },
        avgProjectScore: { $avg: '$projectScore' },
        avgProblemSolvingScore: { $avg: '$problemSolvingScore' }
      }
    }
  ]);

  res.status(200).json(new ApiResponse(200, stats.length > 0 ? stats[0] : null, 'Analytics retrieved successfully'));
});
