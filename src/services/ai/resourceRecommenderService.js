const axios = require('axios');
const logger = require('../../utils/logger');

class ResourceRecommenderService {
  async recommendResources(topic, difficulty) {
    try {
      if (!process.env.YOUTUBE_API_KEY) {
        logger.warn('YouTube API Key not configured');
        return [];
      }

      const query = `${difficulty} ${topic} tutorial programming`;
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&key=${process.env.YOUTUBE_API_KEY}`;
      
      const response = await axios.get(url);
      
      return response.data.items.map(item => ({
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        description: item.snippet.description,
        source: 'YouTube',
        type: 'video'
      }));
    } catch (error) {
      logger.error('Error fetching YouTube resources:', error.message);
      return [];
    }
  }
}

module.exports = new ResourceRecommenderService();
