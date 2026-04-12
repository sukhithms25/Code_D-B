const { sanitize } = require('../../utils/helpers/stringHelpers');

/**
 * Interest Detector Service — fast, offline keyword-based detection.
 *
 * Purpose: Provide an instant, zero-cost fallback when OpenAI is
 * unavailable or the input is too short for AI analysis to be useful.
 *
 * This is intentionally NOT a duplicate of chatbotService.detectInterests()
 * which uses OpenAI for deep conversation analysis. This runs locally
 * in microseconds and is used as:
 *   1. Primary detector in resourceRecommenderService (no API call needed)
 *   2. Fallback when OpenAI quota is exceeded
 *   3. Pre-filter to build the search query before hitting static internal resource engine
 */

const INTEREST_MAP = {
  // Frontend
  react:      'React / Frontend',
  angular:    'Angular / Frontend',
  vue:        'Vue.js / Frontend',
  html:       'HTML / CSS',
  css:        'HTML / CSS',
  tailwind:   'CSS Frameworks',
  bootstrap:  'CSS Frameworks',
  frontend:   'Frontend Development',

  // Backend
  node:       'Node.js / Backend',
  express:    'Node.js / Backend',
  django:     'Python / Backend',
  flask:      'Python / Backend',
  fastapi:    'Python / Backend',
  backend:    'Backend Development',
  api:        'API Development',
  rest:       'API Development',

  // Languages
  python:     'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  java:       'Java',
  cpp:        'C++',
  golang:     'Go',
  rust:       'Rust',

  // Data / AI
  ai:         'Artificial Intelligence',
  ml:         'Machine Learning',
  'deep learning': 'Deep Learning',
  tensorflow: 'Machine Learning',
  pytorch:    'Machine Learning',
  data:       'Data Science',
  pandas:     'Data Science',
  sql:        'Databases',
  mongodb:    'Databases',
  database:   'Databases',

  // DevOps / Cloud
  docker:     'DevOps',
  kubernetes: 'DevOps',
  aws:        'Cloud Computing',
  azure:      'Cloud Computing',
  devops:     'DevOps',

  // General CS
  algorithm:  'Algorithms',
  leetcode:   'Data Structures & Algorithms',
  dsa:        'Data Structures & Algorithms',
  system:     'System Design',
  web:        'Web Development',
};

/**
 * Detects learning interests from a plain-text string.
 *
 * @param   {string} text - Raw text (resume content, chat message, profile bio)
 * @returns {string[]}    - Deduplicated array of matched interest labels
 */
const detectInterests = (text = '') => {
  const input = sanitize(text).toLowerCase();
  const found = new Set();

  for (const [keyword, interest] of Object.entries(INTEREST_MAP)) {
    if (input.includes(keyword)) {
      found.add(interest);
    }
  }

  return [...found];
};

module.exports = { detectInterests };
