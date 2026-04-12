const Announcement = require('../../models/Announcement');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');

/**
 * GET /api/v1/student/announcements
 * Student views all active announcements targeted to them (by branch/year or global).
 */
const getStudentAnnouncements = catchAsync(async (req, res, next) => {
  const { branch, year } = req.user;

  const filter = {
    isArchived: false,
    $or: [
      { targetBranch: null,   targetYear: null },  // Global
      { targetBranch: branch, targetYear: null },  // Branch-wide
      { targetBranch: null,   targetYear: year  }, // Year-wide
      { targetBranch: branch, targetYear: year  }  // Branch + year specific
    ],
    $and: [
      { $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }] }
    ]
  };

  const announcements = await Announcement.find(filter)
    .sort({ priority: -1, createdAt: -1 })
    .populate('createdBy', 'firstName lastName')
    .lean(); // lean for performance

  // Mark which ones the student has already acknowledged
  const userId = req.user._id.toString();
  const enriched = announcements.map(a => ({
    ...a,
    acknowledged: a.acknowledgements.some(ack => ack.studentId.toString() === userId)
  }));

  res.status(200).json(new ApiResponse(200, enriched, 'Announcements retrieved successfully'));
});

/**
 * POST /api/v1/student/announcements/:id/respond
 * Student acknowledges / responds to an announcement.
 */
const respondToAnnouncement = catchAsync(async (req, res, next) => {
  const { response = '' } = req.body;
  const userId = req.user._id;

  const announcement = await Announcement.findById(req.params.id);
  if (!announcement || announcement.isArchived) {
    return next(new AppError('Announcement not found', 404));
  }

  // Check if already acknowledged
  const alreadyAcked = announcement.acknowledgements.some(
    a => a.studentId.toString() === userId.toString()
  );

  if (alreadyAcked) {
    return res.status(200).json(new ApiResponse(200, null, 'Already acknowledged'));
  }

  announcement.acknowledgements.push({ studentId: userId, response, readAt: new Date() });
  await announcement.save();

  res.status(200).json(new ApiResponse(200, null, 'Announcement acknowledged successfully'));
});

module.exports = { getStudentAnnouncements, respondToAnnouncement };
