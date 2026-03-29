const axios = require('axios');
const logger = require('../../utils/logger');

class YoutubeService {
  async searchVideos(query, maxResults = 5) {
    if (!process.env.YOUTUBE_API_KEY) {
      logger.warn('YouTube API Key missing');
      return [];
    }
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${process.env.YOUTUBE_API_KEY}`;
      const { data } = await axios.get(url);
      return data.items;
    } catch (error) {
      logger.error(`YouTube searchVideos error: ${error.message}`);
      throw error;
    }
  }

  async fetchVideoDetails(videoId) {
    if (!process.env.YOUTUBE_API_KEY) return null;
    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`;
      const { data } = await axios.get(url);
      return data.items[0] || null;
    } catch (error) {
      logger.error(`YouTube fetchVideoDetails error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new YoutubeService();
