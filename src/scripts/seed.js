const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { User, Roadmap, Progress, Integration, Announcement } = require('../models');

dotenv.config();

const seedData = async () => {
  try {
    console.log('🚀 Starting Seed Process...');
    
    // 1. Connect to DB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 2. Clear existing data (Be careful in production!)
    await Promise.all([
      User.deleteMany({}),
      Roadmap.deleteMany({}),
      Progress.deleteMany({}),
      Integration.deleteMany({}),
      Announcement.deleteMany({})
    ]);
    console.log('🧹 Cleared existing data');

    // 3. Create HOD
    const hod = await User.create({
      firstName: 'Dr. Surya',
      lastName: 'Prakash',
      email: 'hod@codedb.edu',
      password: 'password123',
      role: 'hod',
      department: 'Computer Science'
    });
    console.log('👨‍🏫 HOD Created');

    // 4. Create Students
    const studentData = [
      { firstName: 'Sukhith', lastName: 'MS', email: 'sukhith@codedb.edu', branch: 'CSE', year: 3, cgpa: 8.5 },
      { firstName: 'Anand', lastName: 'Kumar', email: 'anand@codedb.edu', branch: 'CSE', year: 3, cgpa: 7.8 },
      { firstName: 'Priya', lastName: 'Sharma', email: 'priya@codedb.edu', branch: 'ISE', year: 2, cgpa: 9.2 },
      { firstName: 'Rahul', lastName: 'Verma', email: 'rahul@codedb.edu', branch: 'ECE', year: 4, cgpa: 6.5 },
      { firstName: 'Divya', lastName: 'Reddy', email: 'divya@codedb.edu', branch: 'CSE', year: 3, cgpa: 8.1 }
    ];

    const students = await Promise.all(studentData.map(s => 
      User.create({ ...s, password: 'password123', role: 'student' })
    ));
    console.log(`🎓 Created ${students.length} Students`);

    // 5. Create Integrations & Roadmaps
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      
      // Integration
      await Integration.create({
        studentId: student._id,
        githubUsername: `${student.firstName.toLowerCase()}_dev`,
        leetcodeUsername: `${student.firstName.toLowerCase()}_solve`,
        lastSyncedAt: new Date()
      });

      // Update User stats
      await User.findByIdAndUpdate(student._id, {
        githubConnected: true,
        githubUsername: `${student.firstName.toLowerCase()}_dev`,
        repoCount: 10 + i * 5,
        leetcodeSolved: 50 + i * 20,
        lastGithubSync: new Date()
      });

      // Create an Archived Roadmap (to show history)
      await Roadmap.create({
        studentId: student._id,
        weekNumber: 1,
        title: 'Legacy Python Plan',
        status: 'archived',
        tasks: [
          { title: 'Python Basics', isCompleted: true },
          { title: 'Data Types', isCompleted: true }
        ],
        completionPercentage: 100
      });

      // Create an Active Roadmap
      const goals = ['Full Stack Developer', 'Data Scientist', 'Backend Engineer', 'App Developer', 'DevOps Engineer'];
      const roadmap = await Roadmap.create({
        studentId: student._id,
        weekNumber: 1,
        title: `${goals[i]} Roadmap`,
        status: 'in-progress',
        tasks: [
          { title: 'Foundations', description: 'Core basics of the field', isCompleted: true },
          { title: 'Intermediate Project', description: 'Apply concepts', isCompleted: i % 2 === 0 },
          { title: 'Advanced Scalability', description: 'Scale the app', isCompleted: false },
          { title: 'Deployment', description: 'Go live', isCompleted: false }
        ]
      });

      // Add Progress for the completed task
      await Progress.create({
        studentId: student._id,
        roadmapId: roadmap._id,
        taskId: roadmap.tasks[0]._id,
        completedAt: new Date(),
        notes: 'Finished the foundations module with high score.'
      });

      // Update completion %
      const completedCount = roadmap.tasks.filter(t => t.isCompleted).length;
      roadmap.completionPercentage = Math.round((completedCount / roadmap.tasks.length) * 100);
      await roadmap.save();
    }
    console.log('🗺️ Created Roadmaps and Progress records');

    // 6. Create Announcements
    await Announcement.create([
      {
        title: 'Welcome to Term 2!',
        body: 'Please ensure your GitHub accounts are synced by next Friday.',
        priority: 'high',
        createdBy: hod._id
      },
      {
        title: 'Placement Drive: Google',
        body: 'Google is visiting for summer internships. Eligibility: CGPA > 8.0.',
        priority: 'urgent',
        targetBranch: 'CSE',
        createdBy: hod._id
      }
    ]);
    console.log('📢 Created Announcements');

    console.log('✨ Seed Success! Backend is now 100% demo-ready.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seed Failed:', error.message);
    process.exit(1);
  }
};

seedData();
