const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../../utils/logger');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class ResumeAnalyzerService {
  async analyzeFullResume(resumeText, targetRole) {
    try {
      const model = genAI.getGenerativeModel({ model: process.env.AI_MODEL || "gemini-1.5-flash" });
      const prompt = `You are an expert technical recruiter and AI auditor. Analyze the following resume text for the target role of "${targetRole}".
Resume Text: """${resumeText}"""

Respond ONLY with a raw JSON object (no markdown, no backticks) with the following exact structure:
{
  "score": 85, // integer 0-100
  "skills": ["React", "Node.js", "MongoDB"], // array of detected technical skills
  "gaps": ["Kubernetes", "AWS"], // array of missing key skills for the role
  "match": "85% match for ${targetRole}" // a brief match statement
}`;
      
      const result = await model.generateContent(prompt);
      let text = result.response.text();
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      return JSON.parse(text);
    } catch (error) {
      logger.error('Error analyzing resume with AI:', error);
      throw error;
    }
  }
}

module.exports = new ResumeAnalyzerService();
