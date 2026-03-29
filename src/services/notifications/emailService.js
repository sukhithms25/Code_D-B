const nodemailer = require('nodemailer');
const logger = require('../../utils/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendWelcomeEmail(userEmail, userName) {
    try {
      if (!process.env.EMAIL_USER) return;
      
      const mailOptions = {
        from: `"Code DB" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: 'Welcome to Code DB!',
        text: `Hello ${userName},\n\nWelcome to Code DB! We are excited to have you on board.`,
        html: `<b>Hello ${userName},</b><br>Welcome to Code DB! We are excited to have you on board.`
      };
      
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      logger.error(`Error sending welcome email: ${error.message}`);
    }
  }

  async sendWeeklyProgressEmail(userEmail, progressData) {
    try {
       if (!process.env.EMAIL_USER) return;
       const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Your Weekly Progress Report',
        text: `You have completed ${progressData.completedTasks ? progressData.completedTasks.length : 0} tasks this week!`
       };
       await this.transporter.sendMail(mailOptions);
    } catch (error) {
       logger.error(`Error sending weekly progress email: ${error.message}`);
    }
  }

  async sendRoadmapReminderEmail(userEmail, roadmapData) {
    try {
       if (!process.env.EMAIL_USER) return;
       const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Roadmap Milestone Reminder',
        text: `Don't forget to complete your tasks for week ${roadmapData.weekNumber}!`
       };
       await this.transporter.sendMail(mailOptions);
    } catch (error) {
       logger.error(`Error sending roadmap reminder email: ${error.message}`);
    }
  }
}

module.exports = new EmailService();
