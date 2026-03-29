const envSchema = require('../config/envSchema');

/**
 * Validates environment variables at startup
 * Exits process if validation fails
 */
const validateEnv = () => {
  console.log('🔍 Validating environment variables...');

  const { error, value } = envSchema.validate(process.env, {
    abortEarly: false,
    allowUnknown: true, // Native node processes carry OS variables; must accept unknown keys here too
    stripUnknown: false,
  });

  if (error) {
    console.error('❌ Environment Variable Validation Failed!\n');
    console.error('Missing or invalid configuration:\n');

    error.details.forEach((detail) => {
      const varName = detail.path.join('.');
      const message = detail.message;
      let description = 'No description';
      
      // Pluck the internal description context parameter if set via Joi schema chain
      if (detail.context && detail.context.description) {
        description = detail.context.description;
      }

      console.error(`  • ${varName}: ${message}`);
      console.error(`    Description: ${description}\n`);
    });

    console.error('\n📋 Please check your .env file and ensure all required variables are set.');
    console.error('📄 Copy .env.example to .env and fill in the values.\n');

    process.exit(1);
  }

  console.log('✅ Environment variables validated successfully.\n');
  return value;
};

module.exports = validateEnv;
