const { openai } = require('../../config');
const logger = require('../../utils/logger');

class ChatbotService {
  async detectInterests(conversationHistory) {
    try {
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an AI assistant. Analyze the conversation history and extract the top interests of the user in a JSON array format.' },
          ...conversationHistory
        ],
        response_format: { type: 'json_object' }
      });
      return JSON.parse(response.choices[0].message.content).interests || [];
    } catch (error) {
      logger.error('Error detecting interests:', error);
      throw error;
    }
  }

  async assessSkillLevel(topic, conversationHistory) {
    try {
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: `Assess the user's skill level on ${topic} based on the conversation history. Reply with JSON containing a "skillLevel" key (beginner, intermediate, advanced).` },
          ...conversationHistory
        ],
        response_format: { type: 'json_object' }
      });
      return JSON.parse(response.choices[0].message.content).skillLevel || 'beginner';
    } catch (error) {
      logger.error('Error assessing skill level:', error);
      throw error;
    }
  }
}

module.exports = new ChatbotService();
