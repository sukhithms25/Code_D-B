const axios = require('axios');
const logger = require('../../utils/logger');

class GithubService {
  async fetchUserProfile(token) {
    try {
      const { data } = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      logger.error(`GitHub fetchUserProfile error: ${error.message}`);
      throw error;
    }
  }

  async fetchRepositories(token) {
    try {
      const { data } = await axios.get('https://api.github.com/user/repos?per_page=100', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      logger.error(`GitHub fetchRepositories error: ${error.message}`);
      throw error;
    }
  }

  async fetchCommitActivity(token, username) {
    try {
      const { data } = await axios.get(`https://api.github.com/users/${username}/events/public`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.filter(event => event.type === 'PushEvent');
    } catch (error) {
      logger.error(`GitHub fetchCommitActivity error: ${error.message}`);
      throw error;
    }
  }

  calculateCodingScore(activityData) {
    if (!activityData || activityData.length === 0) return 0;
    
    const commitsCount = activityData.reduce((acc, event) => acc + (event.payload.commits ? event.payload.commits.length : 0), 0);
    const score = Math.min((commitsCount / 50) * 100, 100); // Baseline: 50 commits = 100 points
    return Math.round(score);
  }
}

module.exports = new GithubService();
