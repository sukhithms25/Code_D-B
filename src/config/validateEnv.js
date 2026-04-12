const required = [
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'JWT_REFRESH_SECRET',
  'JWT_REFRESH_EXPIRES_IN',
  'OPENAI_API_KEY'
];

const validateEnv = () => {
  required.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Environment variable missing: ${key} is required`);
    }
  });
};

module.exports = validateEnv;
