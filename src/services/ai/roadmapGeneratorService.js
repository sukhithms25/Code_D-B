const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../../utils/logger');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class RoadmapGeneratorService {
  async generateRoadmap(goal) {
    try {
      const model = genAI.getGenerativeModel({ model: process.env.AI_MODEL || "gemini-1.5-flash" });
      const prompt = `Generate a 4-week learning roadmap for a student interested in: ${goal}. Format as JSON with weekNumber, tasks (title, description), and recommended resources. Ensure the response is valid JSON format matching { "roadmap": [ { "weekNumber": 1, "tasks": [ { "title": "...", "description": "..." } ], "resources": ["..."] } ] }. Do not use markdown backticks, just raw JSON.`;
      
      const result = await model.generateContent(prompt);
      let text = result.response.text();
      text = text.replace(/```json/g, '').replace(/```/g, ''); // strip markdown
      
      return JSON.parse(text).roadmap || [];
    } catch (error) {
      logger.error('Error generating roadmap:', error);
      throw error;
    }
  }
}

module.exports = new RoadmapGeneratorService();
