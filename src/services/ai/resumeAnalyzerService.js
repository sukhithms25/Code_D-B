const { openai } = require('../../config');
const logger = require('../../utils/logger');

class ResumeAnalyzerService {
  async extractSkills(resumeText) {
    try {
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Extract a list of technical and soft skills from the resume text. Return a JSON object with a "skills" array.' },
          { role: 'user', content: resumeText }
        ],
        response_format: { type: 'json_object' }
      });
      return JSON.parse(response.choices[0].message.content).skills || [];
    } catch (error) {
      logger.error('Error extracting skills:', error);
      throw error;
    }
  }

  async calculateExperienceLevel(resumeText) {
    try {
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Analyze the resume text and estimate the total years of professional experience. Return a JSON object with "yearsOfExperience" (number) and "level" (junior, mid, senior).' },
          { role: 'user', content: resumeText }
        ],
        response_format: { type: 'json_object' }
      });
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      logger.error('Error calculating experience:', error);
      throw error;
    }
  }

  async identifyGaps(resumeText, targetRole) {
    try {
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: `Identify missing skills or experience gaps in the resume text for a candidate targeting the role of ${targetRole}. Return a JSON object with a "gaps" array.` },
          { role: 'user', content: resumeText }
        ],
        response_format: { type: 'json_object' }
      });
      return JSON.parse(response.choices[0].message.content).gaps || [];
    } catch (error) {
      logger.error('Error identifying gaps:', error);
      throw error;
    }
  }
}

module.exports = new ResumeAnalyzerService();
