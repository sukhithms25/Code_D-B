const Progress = require('../../models/Progress');
const Roadmap = require('../../models/Roadmap');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');

/**
 * PUT /api/v1/student/progress
 * Body: { roadmapId, taskId, isCompleted, notes }
 */
module.exports = catchAsync(async (req, res, next) => {
  const { roadmapId, taskId, isCompleted, notes } = req.body;

  if (!roadmapId || !taskId) {
    return next(new AppError('roadmapId and taskId are required', 400));
  }

  // 1. Find the roadmap
  const roadmap = await Roadmap.findOne({ 
    _id: roadmapId, 
    studentId: req.user._id 
  });

  if (!roadmap) {
    return next(new AppError('Roadmap not found', 404));
  }

  // 2. Update task in Roadmap collection
  const taskIndex = roadmap.tasks.findIndex(t => t._id.toString() === taskId);
  if (taskIndex === -1) {
    return next(new AppError('Task not found in this roadmap', 404));
  }

  roadmap.tasks[taskIndex].isCompleted = isCompleted;

  // 3. Sync with Progress collection
  if (isCompleted) {
    // Ensure Progress doc exists
    await Progress.findOneAndUpdate(
      { studentId: req.user._id, roadmapId, taskId },
      { notes, completedAt: Date.now() },
      { upsert: true, new: true }
    );
  } else {
    // Remove Progress doc
    await Progress.deleteOne({ studentId: req.user._id, roadmapId, taskId });
  }

  // 4. Update completion percentage and metadata
  const completedCount = roadmap.tasks.filter(t => t.isCompleted).length;
  const percentage = Math.round((completedCount / roadmap.tasks.length) * 100);
  
  roadmap.completionPercentage = percentage;
  
  if (percentage === 100) {
    roadmap.status = 'completed';
    roadmap.completionDate = Date.now();
  } else if (percentage > 0) {
    roadmap.status = 'in-progress';
  } else {
    roadmap.status = 'pending';
  }

  await roadmap.save();

  res.status(200).json(new ApiResponse(200, { roadmap, percentage }, 'Progress updated successfully'));
});
