const { openai } = require('../../config');
const logger = require('../../utils/logger');

class RoadmapGeneratorService {
  async generateRoadmap(interests, skillLevel, weeks = 4) {
    try {
      const prompt = `Generate a ${weeks}-week learning roadmap for a ${skillLevel} level student interested in: ${interests.join(', ')}. Format as JSON with weekNumber, tasks (title, description), and recommended resources.`;
      
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert technical curriculum designer returning structured JSON roadmaps. Key must be "roadmap" containing an array of weekly plans.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      });
      
      return JSON.parse(response.choices[0].message.content).roadmap || [];
    } catch (error) {
      logger.error('Error generating roadmap:', error);
      throw error;
    }
  }
}

module.exports = new RoadmapGeneratorService();
