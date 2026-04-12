const User = require('../../models/User');
const Roadmap = require('../../models/Roadmap');
const emailService = require('./emailService');
const notificationService = require('./notificationService');
const logger = require('../../utils/logger');
const { ROADMAP_STATUS, NOTIFICATION_TYPE } = require('../../utils/enums');
const { USER_ROLE } = require('../../utils/enums');
const { isWithinDays } = require('../../utils/helpers/dateHelpers');

/**
 * Reminder Service
 *
 * Called by the daily cron job (progressReminderJob.js).
 * Three reminder types:
 *
 *  1. sendRoadmapReminders()  — students with in-progress roadmaps
 *                               that haven't been touched in > 2 days
 *  2. sendInactivityReminders() — students with no activity in 7+ days
 *  3. sendLowPerformerAlerts()  — (future) HOD alerts for at-risk students
 */

/**
 * Sends email + in-app notification to students who have an active roadmap
 * but haven't updated it within the last 2 days.
 *
 * @returns {Promise<number>} Count of reminders sent
 */
const sendRoadmapReminders = async () => {
  let count = 0;
  try {
    // Find all in-progress roadmaps with their associated student
    const roadmaps = await Roadmap.find({ status: ROADMAP_STATUS.IN_PROGRESS })
      .populate('studentId', 'email firstName lastName');

    for (const roadmap of roadmaps) {
      const student = roadmap.studentId;
      if (!student || !student.email) continue;

      // Only remind if the roadmap hasn't been updated in > 2 days
      const lastUpdate = roadmap.updatedAt || roadmap.createdAt;
      if (isWithinDays(lastUpdate, 2)) continue; // recently active — skip

      const pendingTasks = roadmap.tasks.filter((t) => !t.isCompleted);
      if (pendingTasks.length === 0) continue;

      const roadmapData = {
        weekNumber: roadmap.weekNumber,
        pendingCount: pendingTasks.length,
        roadmapId: roadmap._id,
      };

      // 1. Email reminder
      await emailService.sendRoadmapReminderEmail(student.email, roadmapData);

      // 2. In-app notification
      await notificationService.createNotification({
        userId:  student._id,
        title:   'Roadmap Reminder',
        message: `You have ${pendingTasks.length} pending task(s) in Week ${roadmap.weekNumber}. Keep the momentum going!`,
        type:    NOTIFICATION_TYPE.REMINDER,
      });

      count++;
    }

    logger.info(`ReminderService.sendRoadmapReminders: Sent ${count} roadmap reminders.`);
  } catch (error) {
    logger.error(`ReminderService.sendRoadmapReminders error: ${error.message}`);
  }
  return count;
};

/**
 * Sends in-app notifications to students who haven't logged in
 * or triggered any activity for 7+ days.
 *
 * Note: True "last login" tracking would require a lastLoginAt field on User.
 * We approximate using updatedAt — students who update their profile/progress
 * are considered active.
 *
 * @returns {Promise<number>} Count of reminders sent
 */
const sendInactivityReminders = async () => {
  let count = 0;
  try {
    const students = await User.find({ role: USER_ROLE.STUDENT });

    for (const student of students) {
      // Use account updatedAt as activity proxy
      const lastActive = student.updatedAt || student.createdAt;
      if (isWithinDays(lastActive, 7)) continue; // still active — skip

      await notificationService.createNotification({
        userId:  student._id,
        title:   "We miss you! 👋",
        message: "You haven't been active in a while. Log in to check your roadmap progress and keep building your skills.",
        type:    NOTIFICATION_TYPE.SYSTEM,
      });

      count++;
    }

    logger.info(`ReminderService.sendInactivityReminders: Sent ${count} inactivity nudges.`);
  } catch (error) {
    logger.error(`ReminderService.sendInactivityReminders error: ${error.message}`);
  }
  return count;
};

/**
 * Master reminder runner. Called by the cron job.
 * Runs both reminder types sequentially, logs totals.
 */
const runAllReminders = async () => {
  logger.info('ReminderService: Starting reminder run...');
  const roadmapCount    = await sendRoadmapReminders();
  const inactivityCount = await sendInactivityReminders();
  logger.info(`ReminderService: Done. Roadmap: ${roadmapCount}, Inactivity: ${inactivityCount}.`);
};

module.exports = { sendRoadmapReminders, sendInactivityReminders, runAllReminders };
