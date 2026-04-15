const mongoose = require('mongoose');

// We will use console.log if logger is not ready, but we should require our logger.
// Assuming logger will be implemented in Step 6
const logger = require('../utils/logger') || console;

const connectDB = async () => {
  try {
    const uri = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_URI_PROD 
      : process.env.MONGODB_URI;

    const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
    if (logger.info) logger.info(`Attempting to connect to: ${maskedUri}`);
    else console.log(`Attempting to connect to: ${maskedUri}`);

    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    if (logger.info) {
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } else {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    
    mongoose.connection.on('connected', () => {
      if (logger.info) logger.info('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      if (logger.error) logger.error(`Mongoose connection error: ${err}`);
      else console.error(`Mongoose connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      if (logger.warn) logger.warn('Mongoose disconnected');
      else console.warn('Mongoose disconnected');
    });

  } catch (error) {
    if (logger.error) {
      logger.error(`Error connecting to MongoDB: ${error.message}`);
      logger.error(`Error Details: ${JSON.stringify(error, null, 2)}`);
    } else {
      console.error(`Error connecting to MongoDB: ${error.message}`);
      console.error('Error Details:', error);
    }
    
    // Implement retry logic for production later, but for now just exit conditionally
    process.exit(1);
  }
};

module.exports = connectDB;
