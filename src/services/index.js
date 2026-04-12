const tokenService = require('./auth/tokenService');
const passwordService = require('./auth/passwordService');

const chatbotService = require('./ai/chatbotService');
const roadmapGeneratorService = require('./ai/roadmapGeneratorService');

const scoringAlgorithmService = require('./scoring/scoringAlgorithmService');
const gradeCalculatorService = require('./scoring/gradeCalculatorService');

const githubService = require('./integrations/githubService');
const leetcodeService = require('./integrations/leetcodeService');

const emailService = require('./notifications/emailService');
const notificationService = require('./notifications/notificationService');

module.exports = {
  tokenService,
  passwordService,
  chatbotService,
  roadmapGeneratorService,
  scoringAlgorithmService,
  gradeCalculatorService,
  githubService,
  leetcodeService,
  emailService,
  notificationService,
};
