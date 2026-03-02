const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

const connectDB = async () => {
  if (!env.MONGO_URI) throw new Error('MONGO_URI is required');
  await mongoose.connect(env.MONGO_URI);
  logger.info('MongoDB connected');
};

module.exports = connectDB;
