const Notification = require('../../models/Notification');
const logger = require('../../utils/logger');

class NotificationService {
  async createNotification({ userId, title, message, type = 'system' }) {
    try {
      const notification = await Notification.create({
        userId,
        title,
        message,
        type
      });
      return notification;
    } catch (error) {
      logger.error(`Error creating notification: ${error.message}`);
      throw error;
    }
  }

  async getUnreadNotifications(userId) {
    try {
      return await Notification.find({ userId, isRead: false }).sort('-createdAt');
    } catch (error) {
      logger.error(`Error fetching unread notifications: ${error.message}`);
      throw error;
    }
  }

  async markAsRead(notificationId) {
    try {
      return await Notification.findByIdAndUpdate(
        notificationId, 
        { isRead: true }, 
        { new: true }
      );
    } catch (error) {
      logger.error(`Error marking notification as read: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new NotificationService();
