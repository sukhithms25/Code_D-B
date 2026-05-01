const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../../utils/logger');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const recommendResources = async (topic, difficulty = 'beginner') => {
  try {
    const model = genAI.getGenerativeModel({ model: process.env.AI_MODEL || "gemini-1.5-flash" });
    const prompt = `You are a technical resource recommender. Provide 3 specific learning resources (links, courses, or docs) for learning "${topic}" at a "${difficulty}" level.
Return ONLY raw JSON in this exact format:
[
  { "title": "...", "type": "article|video|course", "url": "..." },
  { "title": "...", "type": "article|video|course", "url": "..." },
  { "title": "...", "type": "article|video|course", "url": "..." }
]`;
    
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text);
  } catch (error) {
    logger.error('Error generating AI recommendations:', error);
    // fallback to empty if AI fails
    return [];
  }
};

module.exports = { recommendResources };
