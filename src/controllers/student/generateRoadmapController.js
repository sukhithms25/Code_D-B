const User = require("../../models/User");
const Roadmap = require("../../models/Roadmap");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/AppError");

/**
 * POST /api/v1/student/roadmap/generate
 * Generates a new roadmap, archives any existing active roadmap, 
 * and saves to the Roadmap collection.
 */
const generateRoadmapController = catchAsync(async (req, res, next) => {
  const { goal } = req.body;

  if (!goal) {
    return next(new AppError("Goal required", 400));
  }

  const studentId = req.user._id;

  // 1. Archive existing active roadmaps
  await Roadmap.updateMany(
    { studentId, status: { $ne: "archived" } },
    { status: "archived" }
  );

  const lowerGoal = goal.toLowerCase();
  let tasks = [];

  // Simple heuristic-based generation
  if (lowerGoal.includes("full stack")) {
    tasks = [
      { week: 1, title: "HTML, CSS & JS Fundamentals", description: "Master semantic HTML, Flexbox/Grid, and ES6+ basics." },
      { week: 2, title: "React Deep Dive", description: "Learn Hooks (useState, useEffect), components, and state management." },
      { week: 3, title: "Node.js & Express API", description: "Build RESTful services, middleware, and connect to MongoDB." },
      { week: 4, title: "Deployment & Portfolio", description: "Deploy MERN app and optimize for performance." }
    ];
  } else if (lowerGoal.includes("data")) {
    tasks = [
      { week: 1, title: "Python for Data Science", description: "Core syntax, decorators, and basic libraries." },
      { week: 2, title: "Pandas & NumPy", description: "Master data manipulation and cleaning." },
      { week: 3, title: "Exploratory Data Analysis", description: "Visualization using Matplotlib, Seaborn, and Plotly." },
      { week: 4, title: "Mini ML Project", description: "Build a basic regression/classification model." }
    ];
  } else {
    // Fallback for custom goals
    tasks = [
      { week: 1, title: `${goal} - Week 1: Foundation`, description: "Start with basics and environment setup." },
      { week: 2, title: "Deep Dive into core concepts", description: "Intermediate practice and theory." },
      { week: 3, title: "Build a project", description: "Apply concepts to a real-world scenario." },
      { week: 4, title: "Final testing and polishing", description: "Review and refine your skills." }
    ];
  }

  // 2. Create the new Roadmap document
  // The Roadmap model expects { weekNumber, tasks: [{ title, description, isCompleted }] }
  // We'll flatten this simple plan into a 4-week unified roadmap 
  // OR create distinct weeks. Let's stick to the Roadmap schema which has one weekNumber per doc,
  // but to keep it simple and match previous UX, we'll store all 4 weeks of tasks in one 'Active' doc.
  
  const newRoadmap = await Roadmap.create({
    studentId,
    weekNumber: 1, // Current starting week
    title: `${goal} Master Plan`,
    tasks: tasks.map(t => ({
      title: t.title,
      description: t.description,
      isCompleted: false
    })),
    status: "in-progress"
  });

  // 3. Update User meta
  await User.findByIdAndUpdate(studentId, {
    careerGoal: goal
    // We remove the embedded 'roadmap' array from User model later in cleanup
  });

  return res.status(201).json({
    success: true,
    data: newRoadmap
  });
});

module.exports = generateRoadmapController;
