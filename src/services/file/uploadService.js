const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const logger = require('../../utils/logger');

const unlinkAsync = promisify(fs.unlink);
const renameAsync = promisify(fs.rename);

class UploadService {
  async saveFile(file, destination) {
    try {
      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }
      
      const fileName = `${Date.now()}-${file.originalname}`;
      const targetPath = path.join(destination, fileName);
      
      if (file.path) {
          await renameAsync(file.path, targetPath);
      }
      
      return fileName;
    } catch (error) {
      logger.error(`Error saving file: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        await unlinkAsync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      logger.error(`Error deleting file: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new UploadService();
