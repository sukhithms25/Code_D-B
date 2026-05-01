const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../../utils/logger');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class ChatbotService {
  async chat(message, history = []) {
    try {
      const model = genAI.getGenerativeModel({ model: process.env.AI_MODEL || "gemini-1.5-flash" });
      const prompt = `You are an expert AI academic mentor for a student. Reply helpfully and concisely to this message: "${message}"`;
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      logger.error('Error in AI chat:', error);
      throw error;
    }
  }
}

module.exports = new ChatbotService();
