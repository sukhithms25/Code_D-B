// Keys that are always required regardless of AI provider
const required = [
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRE',
  'JWT_REFRESH_SECRET',
  'JWT_REFRESH_EXPIRE',
];

const validateEnv = () => {
  required.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Environment variable missing: ${key} is required`);
    }
  });

  // AI provider check
  const provider = process.env.AI_PROVIDER || 'openai';
  if (provider === 'gemini' && !process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is required when AI_PROVIDER=gemini');
  }
  if (provider === 'openai' && !process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required when AI_PROVIDER=openai');
  }
};

module.exports = validateEnv;
