const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');

const TEMPLATE_DIR = path.join(__dirname, '../../templates/emails');

/**
 * Loads an HTML email template and replaces {{token}} placeholders.
 *
 * @param {string} templateName - Filename without extension (e.g. 'welcomeEmail')
 * @param {Record<string, string>} tokens - Map of token name → replacement value
 * @returns {string} Compiled HTML string
 */
const loadTemplate = (templateName, tokens = {}) => {
  const filePath = path.join(TEMPLATE_DIR, `${templateName}.html`);
  let html = fs.readFileSync(filePath, 'utf8');
  for (const [key, value] of Object.entries(tokens)) {
    html = html.replaceAll(`{{${key}}}`, value ?? '');
  }
  return html;
};

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host:   process.env.EMAIL_HOST,
      port:   Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  /**
   * Core send method. Guards: skips silently if EMAIL_USER is not configured
   * so the app doesn't crash in environments with no email setup.
   */
  async send({ to, subject, html, text }) {
    if (!process.env.EMAIL_USER) {
      logger.warn(`EmailService: EMAIL_USER not set — skipping email to ${to}`);
      return;
    }
    try {
      await this.transporter.sendMail({
        from:    `"Code DB" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]+>/g, ''), // plain-text fallback
      });
      logger.info(`EmailService: Sent "${subject}" to ${to}`);
    } catch (error) {
      logger.error(`EmailService: Failed to send to ${to}: ${error.message}`);
    }
  }

  // ── Specific senders ────────────────────────────────────────────────────────

  async sendWelcomeEmail(userEmail, userName) {
    const html = loadTemplate('welcomeEmail', { name: userName });
    await this.send({ to: userEmail, subject: 'Welcome to Code DB!', html });
  }

  async sendWeeklyProgressEmail(userEmail, progressData) {
    const completedCount = progressData.completedTasks?.length ?? 0;
    const totalCount     = progressData.roadmapId?.tasks?.length ?? 0;
    const percentage     = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const html = loadTemplate('weeklyProgressEmail', {
      name:      progressData.studentName || 'Student',
      score:     String(percentage),
      completed: String(completedCount),
      total:     String(totalCount),
      week:      String(progressData.roadmapId?.weekNumber ?? '—'),
      link:      process.env.FRONTEND_URL || 'http://localhost:3000',
    });
    await this.send({ to: userEmail, subject: 'Your Weekly Progress Report', html });
  }

  async sendRoadmapReminderEmail(userEmail, roadmapData) {
    const html = loadTemplate('roadmapReminderEmail', {
      week:    String(roadmapData.weekNumber),
      pending: String(roadmapData.pendingCount ?? ''),
      link:    `${process.env.FRONTEND_URL || 'http://localhost:3000'}/roadmap`,
    });
    await this.send({ to: userEmail, subject: `Week ${roadmapData.weekNumber} Roadmap Reminder`, html });
  }

  async sendPasswordResetEmail(userEmail, resetToken) {
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    const html = loadTemplate('passwordResetEmail', {
      link:   resetLink,
      expiry: '10 minutes',
    });
    await this.send({ to: userEmail, subject: 'Password Reset Request — Code DB', html });
  }

  async sendLowPerformerAlert(hodEmail, studentData) {
    const html = loadTemplate('lowPerformerAlertEmail', {
      hodName:     studentData.hodName    || 'HOD',
      studentName: studentData.name       || 'Unknown Student',
      score:       String(studentData.score ?? 0),
      grade:       studentData.grade      || 'F',
      link:        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/hod/students/${studentData.studentId}`,
    });
    await this.send({ to: hodEmail, subject: `⚠️ Low Performer Alert: ${studentData.name}`, html });
  }
}

module.exports = new EmailService();
