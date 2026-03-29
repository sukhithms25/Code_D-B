const { OpenAI } = require('openai');

if (!process.env.OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_build', // Fallback to avoid crash on import if omitted
});

module.exports = openai;
