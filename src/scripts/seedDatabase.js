require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const { User, StudentProfile, HODProfile, Roadmap, Evaluation, Notification } = require('../models');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const seed = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not defined in .env');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    const answer = await new Promise(resolve => rl.question('This will delete all existing data. Are you sure? (y/n): ', resolve));
    
    if (answer.toLowerCase() !== 'y') {
      console.log('Seeding aborted.');
      process.exit(0);
    }

    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany(),
      StudentProfile.deleteMany(),
      HODProfile.deleteMany(),
      Roadmap.deleteMany(),
      Evaluation.deleteMany(),
      Notification.deleteMany()
    ]);

    // Create HOD
    const hod = await User.create({
      firstName: 'HOD',
      lastName: 'Demo',
      email: 'hod@test.com',
      password: '123456',
      role: 'hod',
      isVerified: true
    });
    await HODProfile.create({ userId: hod._id, department: 'Computer Science' });

    // Create Students
    const student1 = await User.create({
      firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', password: 'password123', role: 'student', isVerified: true
    });
    const student2 = await User.create({
      firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', password: 'password123', role: 'student', isVerified: true
    });

    await StudentProfile.create([
      { userId: student1._id, CGPA: 8.5, skills: ['JavaScript', 'React'] },
      { userId: student2._id, CGPA: 7.2, skills: ['Python', 'Django'] }
    ]);

    // Create Roadmaps
    await Roadmap.create([
      { studentId: student1._id, weekNumber: 1, tasks: [{ title: 'Learn Node', isCompleted: true }], status: 'in-progress' },
      { studentId: student2._id, weekNumber: 1, tasks: [{ title: 'Learn AI', isCompleted: false }], status: 'pending' }
    ]);

    // Create Evaluations
    await Evaluation.create([
      { studentId: student1._id, codingScore: 90, projectScore: 85, problemSolvingScore: 90, consistencyScore: 80, totalScore: 86.5, grade: 'A' },
      { studentId: student2._id, codingScore: 60, projectScore: 70, problemSolvingScore: 65, consistencyScore: 50, totalScore: 62, grade: 'C' }
    ]);

    // Create Notifications
    await Notification.create([
      { userId: student1._id, title: 'Welcome', message: 'Welcome to Code DB!', type: 'system' }
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
