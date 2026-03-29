const Roadmap = require('../models/Roadmap');
const notificationService = require('../services/notifications/notificationService');
const logger = require('../utils/logger');

const progressReminderJob = async () => {
  try {
    const activeRoadmaps = await Roadmap.find({ status: 'in-progress' }).populate('studentId');
    
    let reminderCount = 0;
    for (const roadmap of activeRoadmaps) {
      if (!roadmap.studentId) continue;
      
      const uncompletedTasks = roadmap.tasks.filter(t => !t.isCompleted);
      if (uncompletedTasks.length > 0) {
        await notificationService.createNotification({
          userId: roadmap.studentId._id,
          title: 'Daily Progress Reminder',
          message: `You have ${uncompletedTasks.length} pending tasks in your current roadmap. Keep going!`,
          type: 'reminder'
        });
        reminderCount++;
      }
    }
    
    logger.info(`ProgressReminderJob: Sent ${reminderCount} daily reminders.`);
  } catch (error) {
    logger.error(`ProgressReminderJob Error: ${error.message}`);
  }
};

module.exports = progressReminderJob;
