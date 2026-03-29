const Roadmap = require('../../models/Roadmap');
const StudentProfile = require('../../models/StudentProfile');
const Progress = require('../../models/Progress');
const roadmapGeneratorService = require('../../services/ai/roadmapGeneratorService');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const ApiResponse = require('../../utils/ApiResponse');

module.exports = catchAsync(async (req, res, next) => {
  const profile = await StudentProfile.findOne({ userId: req.user._id });
  if (!profile || !profile.interests || profile.interests.length === 0) {
    return next(new AppError('Please update your profile with interests to generate a roadmap', 400));
  }

  const { skillLevel = 'beginner', weeks = 4 } = req.body;

  const generatedData = await roadmapGeneratorService.generateRoadmap(profile.interests, skillLevel, weeks);
  
  if (!generatedData || generatedData.length === 0) {
      return next(new AppError('Failed to generate roadmap from AI', 500));
  }

  // Clear pending old roadmaps
  await Roadmap.deleteMany({ studentId: req.user._id, status: 'pending' });

  const createdRoadmaps = [];
  for (const weekPlan of generatedData) {
    const rm = await Roadmap.create({
      studentId: req.user._id,
      weekNumber: weekPlan.weekNumber || 1,
      tasks: (weekPlan.tasks || []).map(t => ({ title: t.title, description: t.description })),
      status: weekPlan.weekNumber === 1 ? 'in-progress' : 'pending'
    });
    createdRoadmaps.push(rm);
  }

  if (createdRoadmaps.length > 0) {
     await Progress.create({
        studentId: req.user._id,
        roadmapId: createdRoadmaps[0]._id
     });
  }

  res.status(201).json(new ApiResponse(201, createdRoadmaps, 'Roadmap generated successfully'));
});
