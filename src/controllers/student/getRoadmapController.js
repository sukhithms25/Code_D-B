const Roadmap = require('../../models/Roadmap');
const ApiResponse = require('../../utils/ApiResponse');
const catchAsync = require('../../utils/catchAsync');
require('../../models/Resource'); // Force registration for population

/**
 * GET /api/v1/student/roadmap
 * Fetches the current ACTIVE roadmap for the student.
 */
module.exports = catchAsync(async (req, res, next) => {
  const roadmap = await Roadmap.findOne({ 
    studentId: req.user._id, 
    status: { $ne: 'archived' } // Get active/in-progress/pending
  })
  .sort({ createdAt: -1 })
  .populate('resources');

  if (!roadmap) {
    return res.status(404).json(new ApiResponse(404, null, 'No active roadmap found'));
  }

  res.status(200).json(new ApiResponse(200, roadmap, 'Active roadmap retrieved successfully'));
});

