const Progress = require('../../models/Progress');
const Roadmap = require('../../models/Roadmap');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');
const { ROADMAP_STATUS } = require('../../utils/enums');

module.exports = catchAsync(async (req, res, next) => {
  const { roadmapId, taskId, isCompleted } = req.body;

  if (!roadmapId || !taskId) {
     return next(new AppError('roadmapId and taskId are required', 400));
  }

  const roadmap = await Roadmap.findOneAndUpdate(
    { _id: roadmapId, studentId: req.user._id, 'tasks._id': taskId },
    { $set: { 'tasks.$.isCompleted': isCompleted } },
    { new: true }
  );

  if (!roadmap) {
    return next(new AppError('Roadmap or task not found', 404));
  }

  const completedCount = roadmap.tasks.filter(t => t.isCompleted).length;
  const percentage = roadmap.tasks.length === 0 ? 0 : Math.round((completedCount / roadmap.tasks.length) * 100);

  if (percentage === 100) {
     await Roadmap.findByIdAndUpdate(roadmapId, { status: ROADMAP_STATUS.COMPLETED, completionDate: Date.now() });
  } else if (roadmap.status === ROADMAP_STATUS.PENDING) {
     await Roadmap.findByIdAndUpdate(roadmapId, { status: ROADMAP_STATUS.IN_PROGRESS });
  }

  let progress = await Progress.findOne({ studentId: req.user._id, roadmapId });
  if (progress) {
      if (isCompleted) {
         await Progress.findByIdAndUpdate(progress._id, { 
             $addToSet: { completedTasks: taskId },
             completionPercentage: percentage,
             lastUpdated: Date.now()
         });
      } else {
         await Progress.findByIdAndUpdate(progress._id, { 
             $pull: { completedTasks: taskId },
             completionPercentage: percentage,
             lastUpdated: Date.now()
         });
      }
      progress = await Progress.findById(progress._id);
  } else {
      progress = await Progress.create({
         studentId: req.user._id,
         roadmapId,
         completedTasks: isCompleted ? [taskId] : [],
         completionPercentage: percentage
      });
  }

  res.status(200).json(new ApiResponse(200, { roadmap, progress }, 'Progress updated'));
});
